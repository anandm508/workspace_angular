import { ProductService } from "./../product.service";
import { Component, OnInit } from "@angular/core";

@Component({
  templateUrl: "./product-shell.component.html"
})
export class ProductShellComponent implements OnInit {
  pageTitle: string = "Products";
  monthCount: number;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.selectedProduct$.subscribe(product => {
      if (product) {
        const start = new Date(product.releaseDate);
        const now = new Date();

        this.monthCount =
          now.getMonth() -
          start.getMonth() +
          12 * (now.getFullYear() - start.getFullYear());
      } else {
        this.monthCount = 0;
      }
    });
  }
}
