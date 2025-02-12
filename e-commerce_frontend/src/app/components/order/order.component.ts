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
  orders: any[] = [];
  user_id = -1;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.user_id = parseInt(prompt('Please enter your user ID:', '0') || '0', 10);
    this.loadOrders();
  }

  loadOrders() {
    this.apiService.loadOrders(this.user_id).subscribe((data) => {
      this.orders = data;
    });
  }
}
