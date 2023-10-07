import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartData = new EventEmitter<product[] | []>();

  constructor(private http: HttpClient) { }

  // Adds a new product to the server
  addProduct(data: product) {
    return this.http.post('http://localhost:3000/products', data);
  }

  // Fetches a list of all products from the server
  productList() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  // Deletes a product from the server by ID
  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  // Fetches a product from the server by its ID
  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  // Updates an existing product on the server
  updateProduct(product: product) {
    return this.http.put<product>(`http://localhost:3000/products/${product.id}`, product);
  }

  // Fetches a list of popular products from the server
  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=5');
  }

  // Fetches a list of trendy products from the server
  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=50');
  }

  // Searches for products on the server based on a query
  searchProduct(query: string) {
    return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
  }

  // Adds a product to the local cart and emits an event
  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  // Removes a product from the local cart and emits an event
  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  // Adds a product to the server's cart
  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }

  // Fetches the user's cart items from the server and emits an event
  getCartList(userId: number) {
    return this.http
      .get<product[]>('http://localhost:3000/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  // Removes a product from the server's cart
  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  // Fetches the current cart items for a user from the server
  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }

  // Places an order for cart items
  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }

  // Fetches a list of orders for a user
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

  // Deletes cart items by ID and emits an event
  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    });
  }

  // Cancels an order by ID
  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId);
  }
}
