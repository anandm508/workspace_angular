import { ProductCategoryService } from "./../product-categories/product-category.service";
import { catchError, filter, map, startWith } from "rxjs/operators";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import {
  Subscription,
  Observable,
  EMPTY,
  BehaviorSubject,
  combineLatest,
  Subject
} from "rxjs";

import { Product } from "./product";
import { ProductService } from "./product.service";

@Component({
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = "Product List";
  errorMessage = "";
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  //private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.withNewProducts$,
    //this.categorySelectedAction$.pipe(startWith(0)) Required with Subject with no default
    this.categorySelectedAction$
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter(data => {
        return selectedCategoryId
          ? data.categoryId === selectedCategoryId
          : true;
      })
    ),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    this.productService.addNewProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
