import { CrudBaseService } from './abstractions'; 
import { Address, CreateAddressRequest } from '../types'; 

export class AddressService extends CrudBaseService<Address> {
  protected baseEndpoint = '/api/v1/addresses/'; // Endpoint base de endereços

  // ===== ENDEREÇOS =====
  public async getAddresses(): Promise<Address[]> {
    const response = await this.api.get<Address[]>(this.baseEndpoint); // GET todos endereços
    return response.data; // Retorna dados
  }

  public async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    return this.create(addressData); // Cria novo endereço
  }

  public async updateAddress(id: number, addressData: Partial<CreateAddressRequest>): Promise<Address> {
    return this.update(id, addressData); // Atualiza endereço
  }

  public async deleteAddress(id: number): Promise<void> {
    return this.delete(id); // Deleta endereço
  }
}
