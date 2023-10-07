import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | product;
  productMessage: undefined | string;

  constructor(private route: ActivatedRoute, private product: ProductService) {}

  ngOnInit(): void {
    // Retrieve the product ID from the URL route parameter
    let productId = this.route.snapshot.paramMap.get('id');

    // Log the retrieved product ID for debugging
    console.warn('Product ID:', productId);

    // Fetch the product details based on the product ID
    productId &&
      this.product.getProduct(productId).subscribe((data) => {
        // Log the retrieved product data for debugging
        console.warn('Product Data:', data);

        // Assign the fetched product data to the component's property
        this.productData = data;
      });
  }

  submit(data: any) {
    if (this.productData) {
      // Assign the product ID from the fetched data to the submitted data
      data.id = this.productData.id;
    }

    // Update the product with the modified data using the ProductService
    this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        // Set a success message to indicate that the product has been updated
        this.productMessage = 'Product has been updated';
      }
    });

    // Clear the success message after a few seconds to provide feedback
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);

    // Log the submitted data for debugging
    console.warn('Submitted Data:', data);
  }
}

/* displaying the product data for updating, handling form submission, and displaying a success message upon updating a produc */
