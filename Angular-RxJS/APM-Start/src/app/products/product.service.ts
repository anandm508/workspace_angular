import { Supplier } from "./../suppliers/supplier";
import { ProductCategoryService } from "./../product-categories/product-category.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  Observable,
  throwError,
  combineLatest,
  BehaviorSubject,
  Subject,
  merge,
  from
} from "rxjs";
import {
  catchError,
  tap,
  map,
  scan,
  shareReplay,
  mergeMap,
  toArray,
  filter,
  switchMap
} from "rxjs/operators";

import { Product } from "./product";
import { SupplierService } from "../suppliers/supplier.service";
import { ActionSequence } from "protractor";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private productsUrl = "api/products";
  private suppliersUrl = this.supplierService.suppliersUrl;
  private selectionChangedSubject = new BehaviorSubject<number>(0);
  private selectionChangedAction$ = this.selectionChangedSubject.asObservable();
  private newProductSubject = new Subject<Product>();
  private newProductAction$ = this.newProductSubject.asObservable();

  products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    map(products =>
      products.map(
        product =>
          ({
            ...product,
            price: product.price * 1.5,
            searchKey: [product.productName]
          } as Product)
      )
    ),
    tap(data => console.log("Products: ", JSON.stringify(data))),
    catchError(this.handleError)
  );

  productsWithCategory$ = combineLatest(
    this.products$,
    this.productCategoryService.productCategories$
  ).pipe(
    map(([products, categories]) =>
      products.map(
        product =>
          ({
            ...product,
            category: (() => {
              const result = categories.find(c => c.id === product.categoryId);
              return result == null ? "Not Found" : result.name;
            })()
          } as Product)
      )
    ),
    tap(data => console.log("ProductsWithCategory: ", JSON.stringify(data))),
    shareReplay(1)
  );

  withNewProducts$ = merge(
    this.productsWithCategory$,
    this.newProductAction$
  ).pipe(scan((accu: Product[], val: Product) => [...accu, val]));

  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.selectionChangedAction$
  ]).pipe(
    map(([products, selectedProductId]) =>
      products.find(product => product.id === selectedProductId)
    ),
    tap(item => console.log("Selected Item: ", JSON.stringify(item)))
  );

  //Approach:Get it all
  /*
  selectedProductSuppliers$ = combineLatest([
    this.selectedProduct$,
    this.supplierService.suppliers$
  ]).pipe(
    map(([selectedProduct, suppliers]) =>
      suppliers.filter(supplier =>
        selectedProduct.supplierIds.includes(supplier.id)
      )
    ),
    tap(item =>
      console.log("Selected Products's Supplier: ", JSON.stringify(item))
    )
  );
  */

  // Approach : Just in time
  selectedProductSuppliers$ = this.selectedProduct$.pipe(
    filter(prd => Boolean(prd)),
    //a user can keep on selecting products in quick succession, use the last one every time. Or else a mergeMap could have been used
    switchMap(prd =>
      from(prd.supplierIds).pipe(
        mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
        toArray()
      )
    ),
    tap(item =>
      console.log("Selected Products's Supplier: ", JSON.stringify(item))
    )
  );

  selectectedProductChanged(productId: number): void {
    this.selectionChangedSubject.next(productId);
  }

  addNewProduct(newProduct?: Product): void {
    this.newProductSubject.next(newProduct || this.fakeProduct());
  }

  constructor(
    private http: HttpClient,
    private supplierService: SupplierService,
    private productCategoryService: ProductCategoryService
  ) {}

  private fakeProduct() {
    return {
      id: 42,
      productName: "Another One",
      productCode: "TBX-0042",
      description: "Our new product",
      price: 8.9,
      categoryId: 3,
      category: "Toolbox",
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
