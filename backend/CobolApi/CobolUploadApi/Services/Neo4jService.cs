using Neo4j.Driver;
using CobolUploadApi.Models;
using CobolUploadApi.Models.Neo4j;

namespace CobolUploadApi.Services;

public interface INeo4jService
{
    Task InitializeAsync();
    Task<SessionInfo> CreateSessionAsync(CreateSessionRequest request);
    Task<SessionInfo?> GetSessionAsync(string sessionId);
    Task<List<SessionInfo>> GetAllSessionsAsync();
    Task<CobolNode> SaveCobolFileAsync(CobolUploadRequest request, string fileId);
    Task<CobolNode?> GetCobolFileAsync(string id);
    Task<List<CobolNode>> GetCobolFilesBySessionAsync(string sessionId);
    Task<List<CobolNode>> GetAllCobolFilesAsync();
    Task<bool> UpdateCobolFileStatusAsync(string id, string status);
    Task<bool> DeleteCobolFileAsync(string id);
    Task SaveDesignDocumentAsync(string cobolFileId, string fileName, string content, string type);
    Task<List<DesignDocumentNode>> GetDesignDocumentsAsync(string cobolFileId);
}

public class Neo4jService : INeo4jService, IAsyncDisposable
{
    private readonly IDriver _driver;
    private readonly ILogger<Neo4jService> _logger;

    private static DateTime ToDateTime(object value)
    {
        if (value is ZonedDateTime zoned)
        {
            return new DateTime(
                zoned.Year,
                zoned.Month,
                zoned.Day,
                zoned.Hour,
                zoned.Minute,
                zoned.Second,
                zoned.Nanosecond / 1_000_000,
                DateTimeKind.Utc);
        }

        if (value is LocalDateTime local)
        {
            return new DateTime(
                local.Year,
                local.Month,
                local.Day,
                local.Hour,
                local.Minute,
                local.Second,
                local.Nanosecond / 1_000_000,
                DateTimeKind.Local);
        }

        return Convert.ToDateTime(value);
    }

    public Neo4jService(IConfiguration configuration, ILogger<Neo4jService> logger)
    {
        _logger = logger;
        
        var uri = configuration.GetValue<string>("Neo4j:Uri") ?? "bolt://localhost:7687";
        var user = configuration.GetValue<string>("Neo4j:User") ?? "neo4j";
        var password = configuration.GetValue<string>("Neo4j:Password") ?? "cobol-migration-2025";
        
        _driver = GraphDatabase.Driver(uri, AuthTokens.Basic(user, password));
    }

    public async Task InitializeAsync()
    {
        await _driver.VerifyConnectivityAsync();
        _logger.LogInformation("Neo4j connected successfully");
    }

    public async Task<SessionInfo> CreateSessionAsync(CreateSessionRequest request)
    {
        var session = _driver.AsyncSession();
        try
        {
            var sessionId = Guid.NewGuid().ToString();
            var createdAt = DateTime.UtcNow;
            var sessionName = string.IsNullOrWhiteSpace(request.Name)
                ? $"Session-{createdAt:yyyyMMdd-HHmmss}"
                : request.Name!.Trim();

            return await session.ExecuteWriteAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    @"CREATE (s:AnalysisSession {
                        id: $id,
                        name: $name,
                        description: $description,
                        status: $status,
                        createdAt: $createdAt,
                        totalFiles: $totalFiles
                    })
                    RETURN s",
                    new
                    {
                        id = sessionId,
                        name = sessionName,
                        description = request.Description ?? "",
                        status = "created",
                        createdAt,
                        totalFiles = 0
                    });

                var record = await cursor.SingleAsync();
                var node = record["s"].As<INode>();

                return new SessionInfo
                {
                    Id = node.Properties["id"].As<string>(),
                    Name = node.Properties["name"].As<string>(),
                    Status = node.Properties["status"].As<string>(),
                    CreatedAt = ToDateTime(node.Properties["createdAt"]),
                    TotalFiles = node.Properties["totalFiles"].As<int>()
                };
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<SessionInfo?> GetSessionAsync(string sessionId)
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteReadAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    "MATCH (s:AnalysisSession {id: $id}) RETURN s",
                    new { id = sessionId });

                if (!await cursor.FetchAsync())
                {
                    return null;
                }

                var node = cursor.Current["s"].As<INode>();
                return new SessionInfo
                {
                    Id = node.Properties["id"].As<string>(),
                    Name = node.Properties["name"].As<string>(),
                    Status = node.Properties["status"].As<string>(),
                    CreatedAt = ToDateTime(node.Properties["createdAt"]),
                    TotalFiles = node.Properties.ContainsKey("totalFiles")
                        ? node.Properties["totalFiles"].As<int>()
                        : 0
                };
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<List<SessionInfo>> GetAllSessionsAsync()
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteReadAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    @"MATCH (s:AnalysisSession)
                    RETURN s
                    ORDER BY s.createdAt DESC");

                var sessions = new List<SessionInfo>();
                await foreach (var record in cursor)
                {
                    var node = record["s"].As<INode>();
                    sessions.Add(new SessionInfo
                    {
                        Id = node.Properties["id"].As<string>(),
                        Name = node.Properties["name"].As<string>(),
                        Status = node.Properties.ContainsKey("status")
                            ? node.Properties["status"].As<string>()
                            : "created",
                        CreatedAt = node.Properties.ContainsKey("createdAt")
                            ? ToDateTime(node.Properties["createdAt"])
                            : DateTime.UtcNow,
                        TotalFiles = node.Properties.ContainsKey("totalFiles")
                            ? node.Properties["totalFiles"].As<int>()
                            : 0
                    });
                }

                return sessions;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<CobolNode> SaveCobolFileAsync(CobolUploadRequest request, string fileId)
    {
        var session = _driver.AsyncSession();
        try
        {
            var result = await session.ExecuteWriteAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    @"CREATE (c:CobolFile {
                        id: $id,
                        sessionId: $sessionId,
                        fileName: $fileName,
                        relativePath: $relativePath,
                        content: $content,
                        uploadedAt: $uploadedAt,
                        fileSize: $fileSize,
                        description: $description,
                        status: $status
                    })
                    WITH c
                    OPTIONAL MATCH (s:AnalysisSession {id: $sessionId})
                    FOREACH (_ IN CASE WHEN s IS NULL THEN [] ELSE [1] END |
                        MERGE (s)-[:CONTAINS_FILE]->(c)
                        SET s.totalFiles = COALESCE(s.totalFiles, 0) + 1
                    )
                    RETURN c",
                    new
                    {
                        id = fileId,
                        sessionId = request.SessionId,
                        fileName = request.FileName,
                        relativePath = request.RelativePath ?? request.FileName,
                        content = request.Content,
                        uploadedAt = DateTime.UtcNow,
                        fileSize = request.Content.Length,
                        description = request.Description ?? "",
                        status = "uploaded"
                    }
                );
                
                return CobolNode.FromRecord(await cursor.SingleAsync());
            });
            
            return result;
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<CobolNode?> GetCobolFileAsync(string id)
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteReadAsync(async tx =>
            {
                var cursor = await tx.RunAsync("MATCH (c:CobolFile {id: $id}) RETURN c", new { id });
                if (await cursor.FetchAsync())
                    return CobolNode.FromRecord(cursor.Current);
                return null;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<List<CobolNode>> GetAllCobolFilesAsync()
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteReadAsync(async tx =>
            {
                var cursor = await tx.RunAsync("MATCH (c:CobolFile) RETURN c ORDER BY c.uploadedAt DESC");
                var files = new List<CobolNode>();
                await foreach (var record in cursor)
                    files.Add(CobolNode.FromRecord(record));
                return files;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<List<CobolNode>> GetCobolFilesBySessionAsync(string sessionId)
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteReadAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    "MATCH (c:CobolFile {sessionId: $sessionId}) RETURN c ORDER BY c.relativePath, c.fileName",
                    new { sessionId });

                var files = new List<CobolNode>();
                await foreach (var record in cursor)
                {
                    files.Add(CobolNode.FromRecord(record));
                }

                return files;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<bool> UpdateCobolFileStatusAsync(string id, string status)
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteWriteAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    "MATCH (c:CobolFile {id: $id}) SET c.status = $status RETURN c",
                    new { id, status });
                return await cursor.FetchAsync();
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<bool> DeleteCobolFileAsync(string id)
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync("MATCH (c:CobolFile {id: $id}) DETACH DELETE c");
                return true;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task SaveDesignDocumentAsync(string cobolFileId, string fileName, string content, string type)
    {
        var session = _driver.AsyncSession();
        try
        {
            await session.ExecuteWriteAsync(async tx =>
            {
                await tx.RunAsync(
                    @"MATCH (c:CobolFile {id: $cobolFileId})
                    CREATE (d:DesignDocument {
                        id: $id,
                        cobolFileId: $cobolFileId,
                        fileName: $fileName,
                        content: $content,
                        type: $type,
                        createdAt: $createdAt
                    })
                    CREATE (c)-[:HAS_DESIGN]->(d)",
                    new
                    {
                        id = Guid.NewGuid().ToString(),
                        cobolFileId,
                        fileName,
                        content,
                        type,
                        createdAt = DateTime.UtcNow
                    }
                );
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async Task<List<DesignDocumentNode>> GetDesignDocumentsAsync(string cobolFileId)
    {
        var session = _driver.AsyncSession();
        try
        {
            return await session.ExecuteReadAsync(async tx =>
            {
                var cursor = await tx.RunAsync(
                    @"MATCH (c:CobolFile {id: $cobolFileId})-[:HAS_DESIGN]->(d:DesignDocument) 
                    RETURN d ORDER BY d.createdAt DESC",
                    new { cobolFileId });
                
                var docs = new List<DesignDocumentNode>();
                await foreach (var record in cursor)
                {
                    var node = record["d"].As<INode>();
                    docs.Add(new DesignDocumentNode
                    {
                        Id = node.Properties["id"].As<string>(),
                        CobolFileId = node.Properties["cobolFileId"].As<string>(),
                        FileName = node.Properties["fileName"].As<string>(),
                        Content = node.Properties["content"].As<string>(),
                        Type = node.Properties["type"].As<string>(),
                        CreatedAt = ToDateTime(node.Properties["createdAt"])
                    });
                }
                return docs;
            });
        }
        finally
        {
            await session.CloseAsync();
        }
    }

    public async ValueTask DisposeAsync()
    {
        await _driver.DisposeAsync();
    }
}