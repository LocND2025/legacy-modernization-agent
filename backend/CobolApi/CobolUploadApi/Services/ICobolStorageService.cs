using CobolUploadApi.Models;

namespace CobolUploadApi.Services;

public interface ICobolStorageService
{
    Task<SessionInfo> CreateSessionAsync(CreateSessionRequest request);
    Task<SessionInfo?> GetSessionAsync(string sessionId);
    Task<List<SessionInfo>> GetAllSessionsAsync();
    Task<CobolUploadResponse> SaveCobolFileAsync(CobolUploadRequest request);
    Task<SessionBulkUploadResponse> SaveCobolFilesToSessionAsync(string sessionId, List<(IFormFile file, string? relativePath)> files, string? description);
    Task<SessionBulkUploadResponse> SaveZipToSessionAsync(string sessionId, IFormFile zipFile, string? description);
    Task<SessionAnalysisStatus> StartSessionAnalysisAsync(string sessionId);
    Task<SessionAnalysisStatus> GetSessionAnalysisStatusAsync(string sessionId);
    Task<List<SessionAnalysisFileStatus>> GetSessionAnalysisFilesAsync(string sessionId);
    Task<List<SessionProgramItem>> GetSessionProgramsAsync(string sessionId);
    Task<List<SessionDocumentItem>> GetSessionDocumentsAsync(string sessionId);
    Task<List<SourceTreeNode>> GetSessionSourceTreeAsync(string sessionId);
    Task<CobolFileInfo?> GetFileInfoAsync(string id);
    Task<string?> GetFileContentAsync(string id);
    Task<List<CobolFileInfo>> ListAllFilesAsync();
    Task<List<CobolFileInfo>> ListFilesBySessionAsync(string sessionId);
    Task<bool> DeleteFileAsync(string id);
    Task<string?> AnalyzeAndGenerateDesignAsync(string fileId);
    Task<byte[]?> DownloadFileAsync(string id);
    Task<object?> GetDesignDocumentAsync(string id);
}