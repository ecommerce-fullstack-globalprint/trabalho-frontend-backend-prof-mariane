import { BaseApiService } from './base-api.service';
import { 
  SearchParams,
  SearchResult
} from '../types';

export class SearchService extends BaseApiService {
  // ===== BUSCA =====
  public async search(params: SearchParams): Promise<SearchResult> {
    const response = await this.api.get<SearchResult>('/api/v1/search/', {
      params
    });
    return response.data;
  }
}
