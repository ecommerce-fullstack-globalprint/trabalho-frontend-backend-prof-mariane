import { BaseApiService } from './base-api.service';
import { 
  Review,
  CreateReviewRequest,
  PaginatedResponse
} from '../types';

export class ReviewService extends BaseApiService {
  // ===== AVALIAÇÕES =====
  public async getProductReviews(productId: number): Promise<PaginatedResponse<Review>> {
    const response = await this.api.get<PaginatedResponse<Review>>(`/api/v1/products/${productId}/reviews/`);
    return response.data;
  }

  public async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    const response = await this.api.post<Review>('/api/v1/reviews/', reviewData);
    return response.data;
  }

  public async updateReview(id: number, reviewData: Partial<CreateReviewRequest>): Promise<Review> {
    const response = await this.api.patch<Review>(`/api/v1/reviews/${id}/`, reviewData);
    return response.data;
  }

  public async deleteReview(id: number): Promise<void> {
    await this.api.delete(`/api/v1/reviews/${id}/`);
  }
}
