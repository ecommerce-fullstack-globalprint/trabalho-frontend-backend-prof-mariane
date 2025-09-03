// ===== TIPOS DE AUTENTICAÇÃO =====
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

// ===== TIPOS DE PRODUTOS =====
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  stock_quantity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  weight?: number;
  dimensions?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  image_url?: string;
}

export interface ProductFilter {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ===== TIPOS DE CARRINHO =====
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_price: string;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ===== TIPOS DE PEDIDOS =====
export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  total_amount: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  tracking_number?: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_address: string;
  payment_method: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'
  | 'refunded';

// ===== TIPOS DE PEDIDOS CUSTOMIZADOS =====
export interface CustomOrder {
  id: number;
  user: User;
  title: string;
  description: string;
  budget_min: string;
  budget_max: string;
  deadline: string;
  status: CustomOrderStatus;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCustomOrderRequest {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  attachments?: File[];
}

export type CustomOrderStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

// ===== TIPOS DE PAGAMENTO =====
export interface Payment {
  id: number;
  order: number;
  amount: string;
  status: PaymentStatus;
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRequest {
  order_id: number;
  payment_method: string;
  amount: number;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

// ===== TIPOS DE AVALIAÇÕES =====
export interface Review {
  id: number;
  user: User;
  product: Product;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  product_id: number;
  rating: number;
  comment: string;
}

// ===== TIPOS DE NOTIFICAÇÕES =====
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export type NotificationType = 
  | 'order_update'
  | 'payment_update'
  | 'system'
  | 'promotion'
  | 'custom_order';

// ===== TIPOS DE RESPOSTAS DA API =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
  status?: number;
}

// ===== TIPOS DE CONFIGURAÇÃO =====
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface SortParams {
  ordering?: string;
}

// ===== TIPOS DE DASHBOARD =====
export interface DashboardStats {
  total_orders: number;
  total_revenue: string;
  pending_orders: number;
  total_products: number;
  total_customers: number;
  recent_orders: Order[];
}

// ===== TIPOS DE BUSCA =====
export interface SearchParams {
  q?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface SearchResult {
  products: Product[];
  total_count: number;
  suggestions: string[];
}

// ===== TIPOS UTILITÁRIOS =====
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: RequestMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

// ===== TIPOS DE ENDEREÇO =====
export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export interface CreateAddressRequest {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default?: boolean;
}
