import { CrudBaseService } from './abstractions';
import { 
  Address,
  CreateAddressRequest
} from '../types';

export class AddressService extends CrudBaseService<Address> {
  protected baseEndpoint = '/api/v1/addresses/';

  // ===== ENDEREÇOS =====
  public async getAddresses(): Promise<Address[]> {
    const response = await this.api.get<Address[]>(this.baseEndpoint);
    return response.data;
  }

  public async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    return this.create(addressData);
  }

  public async updateAddress(id: number, addressData: Partial<CreateAddressRequest>): Promise<Address> {
    return this.update(id, addressData);
  }

  public async deleteAddress(id: number): Promise<void> {
    return this.delete(id);
  }
}
