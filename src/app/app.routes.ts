// import { Routes } from '@angular/router';
// import { ProductListComponent } from './product-list/product-list.component';
// import { CartComponent } from './cart/cart.component';

// export const routes: Routes = [
//   { path: '', component: ProductListComponent },
//   { path: 'cart', component: CartComponent }
// ];


import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent }
];
