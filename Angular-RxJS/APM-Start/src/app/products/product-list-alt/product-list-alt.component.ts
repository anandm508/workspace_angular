import { catchError } from "rxjs/operators";
import { Component } from "@angular/core";

import { Subscription, EMPTY, Subject } from "rxjs";

import { Product } from "../product";
import { ProductService } from "../product.service";

@Component({
  selector: "pm-product-list",
  templateUrl: "./product-list-alt.component.html"
})
export class ProductListAltComponent {
  pageTitle = "Products";
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productsWithCategory$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  constructor(private productService: ProductService) {}

  onSelected(productId: number): void {
    this.productService.selectectedProductChanged(productId);
  }
}
