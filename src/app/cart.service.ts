import { Injectable } from '@angular/core';
import { Product } from '../product'; 
import { ProductService } from './product.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];
  private stockSubscription: Subscription;

  constructor(private productService: ProductService) {
    this.stockSubscription = this.productService.stock$.subscribe(updatedStock => {
      this.updateCartStock(updatedStock);
    });
  }

  addToCart(product: Product) {
    const cartItem = this.items.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity += product.quantity;
    } else {
      this.items.push({ ...product, quantity: product.quantity });
    }
    product.stock -= product.quantity;
    this.productService.updateProduct(product).subscribe(
      updatedProduct => console.log('Product updated:', updatedProduct),
      error => console.error('Error updating product:', error)
    );
    console.log('Added to cart:', product);
    console.log('Updated cart items:', this.items);
  }

  removeFromCart(product: Product) {
    const cartItem = this.items.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity -= 1;
      if (cartItem.quantity <= 0) {
        this.items = this.items.filter(item => item.id !== product.id);
      }
      product.stock += 1;
      this.productService.updateProduct(product).subscribe(
        updatedProduct => console.log('Product updated:', updatedProduct),
        error => console.error('Error updating product:', error)
      );
      console.log('Removed from cart:', product);
      console.log('Updated cart items:', this.items);
    }
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items.forEach(item => {
      const originalProduct = this.productService.getProduct(item.id).subscribe(originalProduct => {
        originalProduct.stock += item.quantity;
        this.productService.updateProduct(originalProduct).subscribe(
          updatedProduct => console.log('Product updated:', updatedProduct),
          error => console.error('Error updating product:', error)
        );
      });
    });
    console.log('Clearing cart. Items before clear:', this.items);
    this.items = [];
    console.log('Cart cleared. Items after clear:', this.items);
  }

  private updateCartStock(updatedStock: Product[]) {
    this.items.forEach(item => {
      const updatedProduct = updatedStock.find(p => p.id === item.id);
      if (updatedProduct) {
        item.stock = updatedProduct.stock;
      }
    });
  }
}
