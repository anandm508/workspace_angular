import { ProductEditComponent } from "./product-edit.component";
import { Injectable } from "@angular/core";
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

import { LazyServiceModule } from "../lazy-service.module";

@Injectable({ providedIn: LazyServiceModule })
export class ProductEditGuard implements CanDeactivate<ProductEditComponent> {
  canDeactivate(
    component: ProductEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.isDirty) {
      const productName = component.product.productName || "New Product";
      return confirm(`Navigate away and lose all changes to ${productName} ?`);
    }
    return true;
  }
}
