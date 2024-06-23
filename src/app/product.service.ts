import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../product'; 
import { tap } from 'rxjs/operators';

const API_URL = 'https://64a41cc1c3b509573b5715b7.mockapi.io/api/stock';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private stockSubject = new BehaviorSubject<Product[]>([]);
  public stock$ = this.stockSubject.asObservable();

  constructor(private http: HttpClient) {}

  public getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL);
  }

  public getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/${id}`);
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${API_URL}/${product.id}`, product).pipe(
      tap((updatedProduct: Product) => {
        this.updateStock(updatedProduct);
      })
    );
  }

  private updateStock(updatedProduct: Product) {
    const currentStock = this.stockSubject.getValue();
    const productIndex = currentStock.findIndex(p => p.id === updatedProduct.id);
    if (productIndex >= 0) {
      currentStock[productIndex] = updatedProduct;
      this.stockSubject.next([...currentStock]);
    }
  }
}
