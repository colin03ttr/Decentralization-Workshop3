import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule, FormsModule]
})
export class OrderComponent {
  total: number = 0;

  constructor(private apiService: ApiService) {}

  placeOrder() {
    this.apiService.placeOrder(1, this.total).subscribe(() => {
      alert('Order placed successfully!');
    });
  }
}
