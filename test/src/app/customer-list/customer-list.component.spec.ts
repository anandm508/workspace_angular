import { CustomerListItem } from './customer-list-datasource';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSortable } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { CustomerListComponent } from './customer-list.component';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerListComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should return customer data without sorting', () => {
    let data: CustomerListItem[];
    component.dataSource.connect().subscribe({
      next(x) {
        data = x;
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('completed');
      },
    });
    expect(data.length).toBeGreaterThan(0);
  });

  it('should return customer data with name sorting', () => {
    let data: CustomerListItem[];
    component.sort.sort({ id: 'name', start: 'asc' } as MatSortable);
    component.dataSource.connect().subscribe({
      next(x) {
        data = x;
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('completed');
      },
    });
    expect(data.length).toBeGreaterThan(0);
  });

  it('should return customer data with id sorting', () => {
    let data: CustomerListItem[];
    component.sort.sort({ id: 'id', start: 'asc' } as MatSortable);
    component.dataSource.connect().subscribe({
      next(x) {
        data = x;
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('completed');
      },
    });
    expect(data.length).toBeGreaterThan(0);
  });
});
