import { NgModel } from "@angular/forms";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "pm-criteria",
  templateUrl: "./criteria.component.html",
  styleUrls: ["./criteria.component.css"]
})
export class CriteriaComponent implements OnInit, OnChanges, AfterViewInit {
  private _listFilter: string;
  @Input()
  displayDetail: boolean;

  @Input()
  hitCount: number;

  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  hitMessage: string;

  @ViewChild(NgModel) filterElementRef: NgModel;
  @ViewChild("filterElement") _filterElementRef: ElementRef;

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(listFilter: string) {
    this._listFilter = listFilter;
    this.valueChange.emit(listFilter);
  }

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["hitCount"] && !changes["hitCount"].currentValue) {
      this.hitMessage = "No matches found";
    } else {
      this.hitMessage = `Hits: ${this.hitCount}`;
    }
  }
  ngAfterViewInit(): void {
    if (this._filterElementRef) {
      this._filterElementRef.nativeElement.focus();
    }
    if (this.filterElementRef) {
      this.filterElementRef.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(val => console.log(val));
    }
  }

  ngOnInit() {}
}
