import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult: undefined | product[];

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    // Retrieve the search query from the URL route parameter
    let query = this.activeRoute.snapshot.paramMap.get('query');

    // Output the search query to the console for debugging
    console.warn(query);

    // Fetch products based on the search query if the query exists
    if (query) {
      this.product.searchProduct(query).subscribe((result) => {
        this.searchResult = result;
      });
    }
  }
}

