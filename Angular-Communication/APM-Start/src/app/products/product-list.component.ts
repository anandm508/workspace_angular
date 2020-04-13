import { ProductParameterService } from "./product-parameter.service";
import { CriteriaComponent } from "./../shared/criteria/criteria.component";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList
} from "@angular/core";

import { IProduct } from "./product";
import { ProductService } from "./product.service";
import { NgModel } from "@angular/forms";

@Component({
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit, AfterViewInit {
  pageTitle: string = "Product List";

  imageWidth: number = 50;
  imageMargin: number = 2;
  errorMessage: string;
  includeDetail: boolean = true;

  filteredProducts: IProduct[];
  products: IProduct[];

  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;
  /*
  @ViewChild("filterElement") filterElementRef: ElementRef;
  /* @ViewChildren("filterElement, nameElement") inputElementRefs: QueryList<
    ElementRef
  >;

  @ViewChild(NgModel) filterInput: NgModel;

  private _filterInput: NgModel;

  get filterInput1(): NgModel {
    return this._filterInput;
  }

  @ViewChild(NgModel)
  set filterInput1(_filterInput: NgModel) {
    this._filterInput = _filterInput;
    //Cavet : Watch for multiple subscriptions getting created
    if (_filterInput)
      this._filterInput.valueChanges.subscribe(() =>
        this.performFilter(this.listFilter)
      );
  }*/

  get showImage(): boolean {
    return this.productParameterService.showImage;
  }

  set showImage(showImage: boolean) {
    this.productParameterService.showImage = showImage;
  }

  constructor(
    private productService: ProductService,
    private productParameterService: ProductParameterService
  ) {}
  ngAfterViewInit(): void {
    /*console.log(this.filterElementRef);
    console.log(this.filterInput);
    this.filterElementRef.nativeElement.focus();
    this.filterInput.valueChanges.subscribe(() =>
      this.performFilter(this.listFilter)
    );*/
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
        this.filterComponent.listFilter = this.productParameterService.filterBy;
        //this.performFilter(this.productParameterService.filterBy);
      },
      (error: any) => (this.errorMessage = <any>error)
    );
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  onValueChange(filterBy: string): void {
    this.productParameterService.filterBy = filterBy;
    this.performFilter(filterBy);
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      this.filteredProducts = this.products.filter(
        (product: IProduct) =>
          product.productName
            .toLocaleLowerCase()
            .indexOf(filterBy.toLocaleLowerCase()) !== -1
      );
    } else {
      this.filteredProducts = this.products;
    }
  }
}
