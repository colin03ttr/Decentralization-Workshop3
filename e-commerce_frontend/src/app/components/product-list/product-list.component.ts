import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addProduct() {
    this.apiService.addProduct(this.newProduct).subscribe(() => {
      alert('Product added');
    });
    window.location.reload();
  }

  addToCart(productId: number) {
    this.apiService.addToCart(1, productId, 1).subscribe(() => {
      alert('Product added to cart');
    });
  }
}
