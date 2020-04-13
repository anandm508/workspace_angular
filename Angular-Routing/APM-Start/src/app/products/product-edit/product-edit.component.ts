import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { MessageService } from "../../messages/message.service";

import { Product, ProductResolved } from "../product";
import { ProductService } from "../product.service";

@Component({
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.css"]
})
export class ProductEditComponent implements OnInit {
  pageTitle = "Product Edit";
  errorMessage: string;
  isDataValid: { [key: string]: boolean };
  private currentProduct: Product;
  private originalProduct: Product;

  get isDirty(): boolean {
    return (
      JSON.stringify(this.currentProduct) !==
      JSON.stringify(this.originalProduct)
    );
  }

  get product(): Product {
    return this.currentProduct;
  }

  set product(value: Product) {
    this.currentProduct = value;
    //Clone to keep a copy
    this.originalProduct = { ...value };
  }

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    /*const id = +this.route.snapshot.paramMap.get("id");
    this.getProduct(id);*/

    //this.route.paramMap.subscribe(params => this.getProduct(+params.get("id")));

    this.route.data.subscribe(data => {
      this.errorMessage = data["resolvedData"]?.error;
      this.onProductRetrieved(data["resolvedData"]?.product);
    });
  }

  /*getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => (this.errorMessage = err)
    });
  }*/

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = "No product found";
    } else {
      if (this.product.id === 0) {
        this.pageTitle = "Add Product";
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () =>
            this.onSaveComplete(`${this.product.productName} was deleted`),
          error: err => (this.errorMessage = err)
        });
      }
    }
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.isDataValid[path];
    }
    return (
      this.isDataValid &&
      Object.keys(this.isDataValid).every(d => this.isDataValid[d] === true)
    );
  }
  validate() {
    this.isDataValid = {};
    if (
      this.product.productName &&
      this.product.productName.length >= 3 &&
      this.product.productCode
    ) {
      this.isDataValid["info"] = true;
    } else {
      this.isDataValid["info"] = false;
    }

    if (this.product.category && this.product.category.length >= 3) {
      this.isDataValid["tags"] = true;
    } else {
      this.isDataValid["tags"] = false;
    }
  }

  saveProduct(): void {
    if (this.isValid() === true) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () =>
            this.onSaveComplete(
              `The new ${this.product.productName} was saved`
            ),
          error: err => (this.errorMessage = err)
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () =>
            this.onSaveComplete(
              `The updated ${this.product.productName} was saved`
            ),
          error: err => (this.errorMessage = err)
        });
      }
    } else {
      this.errorMessage = "Please correct the validation errors.";
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();
    // Navigate back to the product list
    this.router.navigate(["/products"]);
  }

  reset() {
    this.originalProduct = null;
    this.currentProduct = null;
    this.isDataValid = null;
  }
}
