import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCart(1).subscribe((data) => {
      this.cartItems = data;
      if (this.cartItems.length > 0 && this.cartItems[0].product_id) {
        this.apiService.getProduct(this.cartItems[0].product_id).subscribe((product) => {
          this.cartItems[0].product = product;
        });
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  }

  placeOrder() {
    this.apiService.placeOrder(1, this.getTotal()).subscribe(() => {
      alert('Order placed successfully!');
    });
  }
}
