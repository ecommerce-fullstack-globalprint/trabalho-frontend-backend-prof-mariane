import { BaseApiService } from './base-api.service';

export class FileUploadService extends BaseApiService {
  // ===== UPLOAD DE ARQUIVOS =====
  public async uploadFile(file: File, path?: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const response = await this.api.post<{ url: string }>('/api/v1/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}
