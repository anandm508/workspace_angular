import { Supplier } from "./supplier";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { throwError, of } from "rxjs";
import {
  map,
  tap,
  concatMap,
  mergeMap,
  switchMap,
  catchError,
  shareReplay
} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SupplierService {
  suppliersUrl = "api/suppliers";

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl).pipe(
    shareReplay(1),
    tap(data => console.log(JSON.stringify(data))),
    catchError(this.handleError)
  );

  suppliersWithMap$ = of(1, 5, 8).pipe(
    map(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersWithConcatMap$ = of(1, 5, 8).pipe(
    tap(id => console.log(`Supplier id=${id}`)),
    concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersWithMergeMap$ = of(1, 5, 8).pipe(
    tap(id => console.log(`Supplier id=${id}`)),
    mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersWithSwitchMap$ = of(1, 5, 8).pipe(
    tap(id => console.log(`Supplier id=${id}`)),
    switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  constructor(private http: HttpClient) {
    /*this.suppliersWithMap$.subscribe(o =>
      o.subscribe(i => console.log("Supplier :", i))
    );

    this.suppliersWithConcatMap$.subscribe(i =>
      console.log("Contact Map Result:", i)
    );
    this.suppliersWithMergeMap$.subscribe(i =>
      console.log("Merge Map Result:", i)
    );
    this.suppliersWithSwitchMap$.subscribe(i =>
      console.log("Switch Map Result:", i)
    );*/
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
