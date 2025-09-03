import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { ReviewService } from './review.service';
import { NotificationService } from './notification.service';
import { SearchService } from './search.service';
import { DashboardService } from './dashboard.service';
import { AddressService } from './address.service';
import { FileUploadService } from './file-upload.service';

// ===== EXPORTS DE ABSTRAÇÕES =====
export { CrudBaseService, LocalStorageManager } from './abstractions';

// ===== CLASSE PRINCIPAL QUE COMBINA TODOS OS SERVIÇOS =====
export class ApiService {
  public auth: AuthService;
  public products: ProductService;
  public cart: CartService;
  public orders: OrderService;
  public payments: PaymentService;
  public reviews: ReviewService;
  public notifications: NotificationService;
  public search: SearchService;
  public dashboard: DashboardService;
  public addresses: AddressService;
  public fileUpload: FileUploadService;

  constructor() {
    this.auth = new AuthService();
    this.products = new ProductService();
    this.cart = new CartService();
    this.orders = new OrderService();
    this.payments = new PaymentService();
    this.reviews = new ReviewService();
    this.notifications = new NotificationService();
    this.search = new SearchService();
    this.dashboard = new DashboardService();
    this.addresses = new AddressService();
    this.fileUpload = new FileUploadService();
  }

  // ===== MÉTODOS DE CONVENIÊNCIA PARA COMPATIBILIDADE =====
  // Mantém a mesma interface pública da classe original

  // Auth methods
  public isAuthenticated = () => this.auth.isAuthenticated();
  public getCurrentUser = () => this.auth.getCurrentUser();
  public login = (credentials: any) => this.auth.login(credentials);
  public register = (userData: any) => this.auth.register(userData);
  public logout = () => this.auth.logout();
  public refreshToken = () => this.auth.refreshToken();

  // Product methods
  public getProducts = (filters?: any) => this.products.getProducts(filters);
  public getProduct = (id: number) => this.products.getProduct(id);
  public createProduct = (productData: any) => this.products.createProduct(productData);
  public updateProduct = (id: number, productData: any) => this.products.updateProduct(id, productData);
  public deleteProduct = (id: number) => this.products.deleteProduct(id);

  // Cart methods
  public getCart = () => this.cart.getCart();
  public addToCart = (item: any) => this.cart.addToCart(item);
  public updateCartItem = (itemId: number, data: any) => this.cart.updateCartItem(itemId, data);
  public removeFromCart = (itemId: number) => this.cart.removeFromCart(itemId);
  public clearCart = () => this.cart.clearCart();

  // Order methods
  public getOrders = () => this.orders.getOrders();
  public getOrder = (id: number) => this.orders.getOrder(id);
  public createOrder = (orderData: any) => this.orders.createOrder(orderData);
  public cancelOrder = (id: number) => this.orders.cancelOrder(id);
  public getCustomOrders = () => this.orders.getCustomOrders();
  public getCustomOrder = (id: number) => this.orders.getCustomOrder(id);
  public createCustomOrder = (orderData: any) => this.orders.createCustomOrder(orderData);

  // Payment methods
  public getPayments = () => this.payments.getPayments();
  public createPayment = (paymentData: any) => this.payments.createPayment(paymentData);
  public getPayment = (id: number) => this.payments.getPayment(id);

  // Review methods
  public getProductReviews = (productId: number) => this.reviews.getProductReviews(productId);
  public createReview = (reviewData: any) => this.reviews.createReview(reviewData);
  public updateReview = (id: number, reviewData: any) => this.reviews.updateReview(id, reviewData);
  public deleteReview = (id: number) => this.reviews.deleteReview(id);

  // Notification methods
  public getNotifications = () => this.notifications.getNotifications();
  public markNotificationAsRead = (id: number) => this.notifications.markNotificationAsRead(id);
  public markAllNotificationsAsRead = () => this.notifications.markAllNotificationsAsRead();

  // Search methods
  public searchProducts = (params: any) => this.search.search(params);

  // Dashboard methods
  public getDashboardStats = () => this.dashboard.getDashboardStats();

  // Address methods
  public getAddresses = () => this.addresses.getAddresses();
  public createAddress = (addressData: any) => this.addresses.createAddress(addressData);
  public updateAddress = (id: number, addressData: any) => this.addresses.updateAddress(id, addressData);
  public deleteAddress = (id: number) => this.addresses.deleteAddress(id);

  // File upload methods
  public uploadFile = (file: File, path?: string) => this.fileUpload.uploadFile(file, path);
}

// ===== INSTÂNCIA SINGLETON =====
const apiService = new ApiService();
export default apiService;

// ===== EXPORTS INDIVIDUAIS =====
export {
  AuthService,
  ProductService,
  CartService,
  OrderService,
  PaymentService,
  ReviewService,
  NotificationService,
  SearchService,
  DashboardService,
  AddressService,
  FileUploadService
};
