import { BaseApiService } from './base-api.service';
import { 
  Address,
  CreateAddressRequest
} from '../types';

export class AddressService extends BaseApiService {
  // ===== ENDEREÇOS =====
  public async getAddresses(): Promise<Address[]> {
    const response = await this.api.get<Address[]>('/api/v1/addresses/');
    return response.data;
  }

  public async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    const response = await this.api.post<Address>('/api/v1/addresses/', addressData);
    return response.data;
  }

  public async updateAddress(id: number, addressData: Partial<CreateAddressRequest>): Promise<Address> {
    const response = await this.api.patch<Address>(`/api/v1/addresses/${id}/`, addressData);
    return response.data;
  }

  public async deleteAddress(id: number): Promise<void> {
    await this.api.delete(`/api/v1/addresses/${id}/`);
  }
}
