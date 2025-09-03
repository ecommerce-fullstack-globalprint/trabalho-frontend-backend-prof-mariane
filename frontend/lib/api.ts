// ===== IMPORTAÇÃO DA NOVA ESTRUTURA MODULAR =====
import apiService from './services';
import { AxiosError } from 'axios';

// ===== RE-EXPORT PARA COMPATIBILIDADE =====
export default apiService;
export { ApiService } from './services';
export type { AxiosError as ApiRequestError };
