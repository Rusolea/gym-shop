import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../product'; 
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe((data: Product[]) => {
      this.products = data.map(product => ({ ...product, quantity: 0 }));
      console.log('Fetched products:', this.products);
    });
  }

  increaseQuantity(product: Product) {
    if (product.stock > product.quantity) {
      product.quantity += 1;
      product.stock -= 1;
    }
  }

  decreaseQuantity(product: Product) {
    if (product.quantity > 0) {
      product.quantity -= 1;
      product.stock += 1;
    }
  }

  addToCart(product: Product) {
    if (product.quantity > 0) {
      this.cartService.addToCart({ ...product });
      product.quantity = 0; // Reset quantity to zero after adding to cart
      
    }
  }
}
