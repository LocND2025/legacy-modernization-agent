using System.ComponentModel.DataAnnotations;

namespace CobolUploadApi.Models;

public class CobolUploadRequest
{
    [Required]
    public string FileName { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;

    public string? SessionId { get; set; }

    public string? RelativePath { get; set; }
    
    public string? Description { get; set; }
    
    public Dictionary<string, string>? Metadata { get; set; }
}

public class CobolUploadResponse
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? SessionId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string? RelativePath { get; set; }
    public DateTime UploadedAt { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string Status { get; set; } = "success";
    public string? DesignDocumentPath { get; set; }
    public List<string> Warnings { get; set; } = new();
}

public class CobolFileInfo
{
    public string Id { get; set; } = string.Empty;
    public string? SessionId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string? RelativePath { get; set; }
    public DateTime UploadedAt { get; set; }
    public long FileSize { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class AnalyzeRequest
{
    public string FileId { get; set; } = string.Empty;
    public bool GenerateDesign { get; set; } = true;
}

public class CreateSessionRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}

public class SessionInfo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "created";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int TotalFiles { get; set; }
}

public class SessionBulkUploadResponse
{
    public string SessionId { get; set; } = string.Empty;
    public int UploadedCount { get; set; }
    public int FailedCount { get; set; }
    public List<CobolUploadResponse> Files { get; set; } = new();
    public List<string> Errors { get; set; } = new();
}

public class SessionAnalysisStatus
{
    public string SessionId { get; set; } = string.Empty;
    public string Status { get; set; } = "idle"; // idle | queued | running | completed | failed
    public int TotalFiles { get; set; }
    public int ProcessedFiles { get; set; }
    public int FailedFiles { get; set; }
    public string? CurrentFileId { get; set; }
    public string? CurrentFileName { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Error { get; set; }
    public double ProgressPercentage =>
        TotalFiles <= 0 ? 0 : Math.Round((double)ProcessedFiles * 100 / TotalFiles, 2);
}

public class SessionAnalysisFileStatus
{
    public string FileId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string? RelativePath { get; set; }
    public string Status { get; set; } = "uploaded"; // uploaded | processing | analyzed | failed
}

public class SessionProgramItem
{
    public string FileId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public long Loc { get; set; }
    public string Status { get; set; } = "uploaded";
    public List<string> Tags { get; set; } = new();
}

public class SessionDocumentItem
{
    public string Id { get; set; } = string.Empty;
    public string FileId { get; set; } = string.Empty;
    public string ProgramCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = "markdown";
}

public class SourceTreeNode
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Kind { get; set; } = "folder"; // folder | file
    public string? FileId { get; set; }
    public string? RelativePath { get; set; }
    public List<SourceTreeNode> Children { get; set; } = new();
}