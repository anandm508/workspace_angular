import { ProductService } from "./product.service";
import { ProductResolved } from "./product";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { LazyServiceModule } from "./lazy-service.module";

@Injectable({ providedIn: LazyServiceModule })
export class ProductResolver implements Resolve<ProductResolved> {
  constructor(private productService: ProductService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProductResolved> {
    const id = route.paramMap.get("id");
    if (isNaN(+id)) {
      const errorMessage = `Product id ${id} is not a number`;
      return of({ product: null, error: errorMessage });
    } else {
      return this.productService.getProduct(+id).pipe(
        map((product) => ({
          product: product,
        })),
        catchError((err) => {
          return of({ product: null, error: err });
        })
      );
    }
  }
}
