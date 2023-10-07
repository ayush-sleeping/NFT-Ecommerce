import { Component, OnInit } from '@angular/core';
import { order } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orderData: order[] | undefined;

  constructor(private product: ProductService) { }

  ngOnInit(): void {
    // When the component initializes, fetch and display the list of orders
    this.getOrderList();
  }

  cancelOrder(orderId: number | undefined) {
    // Function to cancel an order by its ID
    // Check if an order ID is provided and then call the ProductService to cancel the order
    orderId && this.product.cancelOrder(orderId).subscribe((result) => {
      // After cancelling the order, refresh the list of orders
      if (result) {
        this.getOrderList();
      }
    });
  }

  getOrderList() {
    // Function to fetch the list of orders from the ProductService and update the orderData property
    this.product.orderList().subscribe((result) => {
      this.orderData = result;
    });
  }
}

