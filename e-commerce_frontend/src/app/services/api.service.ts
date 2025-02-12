import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = '/api'; // ✅ Now uses the proxy

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.API_URL}/products`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/products/${id}`);
  }

  addProduct(product: {name: string,description: string, price: Number, stock: Number}): Observable<any> {
    return this.http.post(`${this.API_URL}/products`, product);
  }

  addToCart(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.API_URL}/cart/${userId}`, { product_id: productId, quantity });
  }

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/cart/${userId}`);
  }

  placeOrder(userId: number, total: number): Observable<any> {
    return this.http.post(`${this.API_URL}/orders`, { user_id: userId, total });
  }

  loadOrders(user_id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/orders/${user_id}`);
  }
}
