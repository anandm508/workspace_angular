import { IProduct } from "./../product";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { ProductService } from "../product.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "pm-product-shell-list",
  templateUrl: "./product-shell-list.component.html"
})
export class ProductShellListComponent implements OnInit, OnDestroy {
  pageTitle: string = "Products";
  errorMessage: string;
  products: IProduct[];
  selectedProduct: IProduct | null;
  subscriptions = new Array<Subscription>();

  constructor(private productService: ProductService) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.productService.getProducts().subscribe(
        (products: IProduct[]) => {
          this.products = products;
        },
        (error: any) => (this.errorMessage = <any>error)
      )
    );

    this.subscriptions.push(
      this.productService.selectedProduct$.subscribe(
        product => (this.selectedProduct = product)
      )
    );
  }

  openSelectedProduct(product: IProduct): void {
    console.log(product);
    this.productService.changeSelectedProduct(product);
  }
}
