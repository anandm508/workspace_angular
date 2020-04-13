import { ProductService } from "./product.service";
import { ProductEditGuard } from "./product-edit/product-edit.guard";
import { ProductEditInfoComponent } from "./product-edit/product-edit-info.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { ProductListComponent } from "./product-list.component";
import { ProductDetailComponent } from "./product-detail.component";
import { ProductEditComponent } from "./product-edit/product-edit.component";

import { SharedModule } from "../shared/shared.module";
import { ProductResolver } from "./product-resolver.servcie";
import { ProductEditTagsComponent } from "./product-edit/product-edit-tags.component";
import { LazyServiceModule } from "./lazy-service.module";

@NgModule({
  imports: [
    LazyServiceModule,
    SharedModule,
    RouterModule.forChild([
      { path: "", component: ProductListComponent },
      {
        path: ":id",
        component: ProductDetailComponent,
        resolve: { resolvedData: ProductResolver },
      },
      {
        path: ":id/edit",
        component: ProductEditComponent,
        canDeactivate: [ProductEditGuard],
        resolve: { resolvedData: ProductResolver },
        children: [
          {
            path: "",
            redirectTo: "info",
            pathMatch: "full",
          },
          {
            path: "info",
            component: ProductEditInfoComponent,
          },
          {
            path: "tags",
            component: ProductEditTagsComponent,
          },
        ],
      },
    ]),
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductEditInfoComponent,
    ProductEditTagsComponent,
  ],
  //providers: [ProductService, ProductResolver, ProductEditGuard], Using providers is old faishoned Angul
})
export class ProductModule {}
