import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent {
  addProductMessage: string | undefined;

  constructor(private product: ProductService) {}

  submit(data: product) {
    // Submit the product data to the service for addition
    this.product.addProduct(data).subscribe((result) => {
      console.warn(result);

      // Display a success message if the product is added successfully
      if (result) {
        this.addProductMessage = 'Product is added successfully';
      }
    });

    // Clear the success message after 3 seconds
    setTimeout(() => {
      this.addProductMessage = undefined;
    }, 3000);
  }
}
