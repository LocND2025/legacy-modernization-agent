using Microsoft.AspNetCore.Mvc;
using CobolUploadApi.Models;
using CobolUploadApi.Services;

namespace CobolUploadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CobolController : ControllerBase
{
    private readonly ICobolStorageService _storageService;
    private readonly ILogger<CobolController> _logger;

    public CobolController(ICobolStorageService storageService, ILogger<CobolController> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Tạo session mới cho phân tích
    /// </summary>
    [HttpPost("sessions")]
    [ProducesResponseType(typeof(SessionInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SessionInfo>> CreateSession([FromBody] CreateSessionRequest request)
    {
        try
        {
            var session = await _storageService.CreateSessionAsync(request ?? new CreateSessionRequest());
            return Ok(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating session");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy thông tin session
    /// </summary>
    [HttpGet("sessions")]
    [ProducesResponseType(typeof(List<SessionInfo>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SessionInfo>>> GetSessions()
    {
        var sessions = await _storageService.GetAllSessionsAsync();
        return Ok(sessions);
    }

    /// <summary>
    /// Lấy thông tin session
    /// </summary>
    [HttpGet("sessions/{sessionId}")]
    [ProducesResponseType(typeof(SessionInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionInfo>> GetSession(string sessionId)
    {
        var session = await _storageService.GetSessionAsync(sessionId);
        if (session == null)
            return NotFound();

        return Ok(session);
    }

    /// <summary>
    /// Bắt đầu phân tích toàn bộ file COBOL trong session (async background)
    /// </summary>
    [HttpPost("sessions/{sessionId}/analysis/start")]
    [ProducesResponseType(typeof(SessionAnalysisStatus), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SessionAnalysisStatus>> StartSessionAnalysis(string sessionId)
    {
        try
        {
            var status = await _storageService.StartSessionAnalysisAsync(sessionId);
            return Ok(status);
        }
        catch (InvalidOperationException ex)
        {
            if (ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
            {
                return NotFound(new { error = ex.Message });
            }

            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting analysis for session {SessionId}", sessionId);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy trạng thái phân tích của session
    /// </summary>
    [HttpGet("sessions/{sessionId}/analysis/status")]
    [ProducesResponseType(typeof(SessionAnalysisStatus), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionAnalysisStatus>> GetSessionAnalysisStatus(string sessionId)
    {
        try
        {
            var status = await _storageService.GetSessionAnalysisStatusAsync(sessionId);
            return Ok(status);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analysis status for session {SessionId}", sessionId);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Upload nhiều file vào cùng một session (multipart/form-data)
    /// </summary>
    [HttpPost("sessions/{sessionId}/files:bulk")]
    [ProducesResponseType(typeof(SessionBulkUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionBulkUploadResponse>> UploadFilesToSession(
        string sessionId,
        [FromForm] List<IFormFile> files,
        [FromForm] List<string>? relativePaths,
        [FromForm] string? description)
    {
        try
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded");

            if (relativePaths != null && relativePaths.Count > 0 && relativePaths.Count != files.Count)
                return BadRequest("relativePaths must match files count");

            List<(IFormFile file, string? relativePath)> payload = files
                .Select((file, index) => (file, relativePaths != null && index < relativePaths.Count ? relativePaths[index] : file.FileName))
                .ToList();

            var result = await _storageService.SaveCobolFilesToSessionAsync(sessionId, payload, description);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading files to session {SessionId}", sessionId);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Upload file ZIP vào session và tự động giải nén file COBOL
    /// </summary>
    [HttpPost("sessions/{sessionId}/upload-zip")]
    [ProducesResponseType(typeof(SessionBulkUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessionBulkUploadResponse>> UploadZipToSession(
        string sessionId,
        IFormFile zipFile,
        [FromForm] string? description)
    {
        try
        {
            if (zipFile == null || zipFile.Length == 0)
                return BadRequest("No ZIP file uploaded");

            if (!zipFile.FileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Uploaded file must be .zip");

            var result = await _storageService.SaveZipToSessionAsync(sessionId, zipFile, description);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading zip to session {SessionId}", sessionId);
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Upload file COBOL
    /// </summary>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(CobolUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CobolUploadResponse>> UploadCobol([FromBody] CobolUploadRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _storageService.SaveCobolFileAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading COBOL file");
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Upload file COBOL dạng multipart/form-data
    /// </summary>
    [HttpPost("upload-file")]
    [ProducesResponseType(typeof(CobolUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CobolUploadResponse>> UploadCobolFile(IFormFile file, [FromForm] string? description)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            using var reader = new StreamReader(file.OpenReadStream());
            var content = await reader.ReadToEndAsync();

            var request = new CobolUploadRequest
            {
                FileName = file.FileName,
                Content = content,
                Description = description
            };

            var result = await _storageService.SaveCobolFileAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading COBOL file");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách tất cả file COBOL
    /// </summary>
    [HttpGet("files")]
    [ProducesResponseType(typeof(List<CobolFileInfo>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CobolFileInfo>>> GetAllFiles()
    {
        var files = await _storageService.ListAllFilesAsync();
        return Ok(files);
    }

    /// <summary>
    /// Lấy danh sách file COBOL theo session
    /// </summary>
    [HttpGet("sessions/{sessionId}/files")]
    [ProducesResponseType(typeof(List<CobolFileInfo>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CobolFileInfo>>> GetFilesBySession(string sessionId)
    {
        var files = await _storageService.ListFilesBySessionAsync(sessionId);
        return Ok(files);
    }

    /// <summary>
    /// Lấy danh sách programs hiển thị ở Programs panel
    /// </summary>
    [HttpGet("sessions/{sessionId}/programs")]
    [ProducesResponseType(typeof(List<SessionProgramItem>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SessionProgramItem>>> GetSessionPrograms(string sessionId)
    {
        var programs = await _storageService.GetSessionProgramsAsync(sessionId);
        return Ok(programs);
    }

    /// <summary>
    /// Lấy danh sách markdown documents theo session cho Docs panel
    /// </summary>
    [HttpGet("sessions/{sessionId}/documents")]
    [ProducesResponseType(typeof(List<SessionDocumentItem>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SessionDocumentItem>>> GetSessionDocuments(string sessionId)
    {
        var docs = await _storageService.GetSessionDocumentsAsync(sessionId);
        return Ok(docs);
    }

    /// <summary>
    /// Lấy cây thư mục source cho Source panel
    /// </summary>
    [HttpGet("sessions/{sessionId}/source-tree")]
    [ProducesResponseType(typeof(List<SourceTreeNode>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SourceTreeNode>>> GetSessionSourceTree(string sessionId)
    {
        var tree = await _storageService.GetSessionSourceTreeAsync(sessionId);
        return Ok(tree);
    }

    /// <summary>
    /// Lấy thông tin file COBOL theo ID
    /// </summary>
    [HttpGet("files/{id}")]
    [ProducesResponseType(typeof(CobolFileInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CobolFileInfo>> GetFileInfo(string id)
    {
        var fileInfo = await _storageService.GetFileInfoAsync(id);
        if (fileInfo == null)
            return NotFound();

        return Ok(fileInfo);
    }

    /// <summary>
    /// Lấy nội dung file COBOL
    /// </summary>
    [HttpGet("files/{id}/content")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<string>> GetFileContent(string id)
    {
        var content = await _storageService.GetFileContentAsync(id);
        if (content == null)
            return NotFound();

        return Ok(new { content });
    }

    /// <summary>
    /// Download file COBOL
    /// </summary>
    [HttpGet("files/{id}/download")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadFile(string id)
    {
        var fileBytes = await _storageService.DownloadFileAsync(id);
        if (fileBytes == null)
            return NotFound();

        var fileInfo = await _storageService.GetFileInfoAsync(id);
        return File(fileBytes, "text/plain", fileInfo?.FileName ?? "download.cbl");
    }

    /// <summary>
    /// Phân tích và sinh design document
    /// </summary>
[HttpPost("analyze/{id}")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> AnalyzeCobolFile(string id)
{
    var fileInfo = await _storageService.GetFileInfoAsync(id);
    if (fileInfo == null)
        return NotFound();

    var outputPath = await _storageService.AnalyzeAndGenerateDesignAsync(id);
    
    if (outputPath == null)
        return StatusCode(500, new { error = "Analysis failed" });

    return Ok(new 
    { 
        message = "Analysis completed", 
        outputPath,
        fileId = id 
    });
}

    /// <summary>
    /// Xóa file COBOL
    /// </summary>
    [HttpDelete("files/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteFile(string id)
    {
        var deleted = await _storageService.DeleteFileAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Lấy design document (nếu đã phân tích)
    /// </summary>
[HttpGet("files/{id}/design")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> GetDesignDocument(string id)
{
    var design = await _storageService.GetDesignDocumentAsync(id);
    if (design == null)
        return NotFound(new { error = "Design document not found. Please analyze first." });

    return Ok(design);
}
}