import { Component, OnInit } from '@angular/core';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];

  constructor(private product: ProductService) {}

  ngOnInit(): void {
    // Fetch popular products and assign them to the 'popularProducts' variable
    this.product.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    });

    // Fetch trendy products and assign them to the 'trendyProducts' variable
    this.product.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });
  }
}
