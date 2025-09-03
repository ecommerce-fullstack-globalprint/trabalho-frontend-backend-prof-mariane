import { CrudBaseService } from './abstractions';
import { 
  Review,
  CreateReviewRequest,
  PaginatedResponse
} from '../types';

export class ReviewService extends CrudBaseService<Review> {
  protected baseEndpoint = '/api/v1/reviews/';

  // ===== AVALIAÇÕES =====
  public async getProductReviews(productId: number): Promise<PaginatedResponse<Review>> {
    const response = await this.api.get<PaginatedResponse<Review>>(`/api/v1/products/${productId}/reviews/`);
    return response.data;
  }

  public async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    return this.create(reviewData);
  }

  public async updateReview(id: number, reviewData: Partial<CreateReviewRequest>): Promise<Review> {
    return this.update(id, reviewData);
  }

  public async deleteReview(id: number): Promise<void> {
    return this.delete(id);
  }
}
