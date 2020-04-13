import { Component, OnInit } from '@angular/core';
import {
  of,
  from,
  Observable,
  interval,
  range,
  asyncScheduler,
  fromEvent,
  merge,
} from 'rxjs';
import { map, take, tap, filter, delay, scan } from 'rxjs/operators';

@Component({
  selector: 'app-rx-js',
  templateUrl: './rx-js.component.html',
  styleUrls: ['./rx-js.component.less'],
})
export class RxJSComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    /*
    //Using of
    of(2, 6, 4, 8).subscribe(console.log);

    //Using from with subscriber object
    from([101, 201, 301]).subscribe({
      next: item => console.log(item),
      error: err => console.log,
      complete: () => console.log
    });

    //Using from operator with next, error and complete callbacks
    from([100, 200, 300]).subscribe(
      item => console.log(`Rendering Item ${item}`),
      err => console.log(err),
      () => console.log('Completed')
    );
*/

    //Merge function demo
    const clicks = fromEvent(document, 'click');
    const timer = interval(1000);
    const clicksOrTimer = merge(timer, clicks).pipe(
      scan((acc: number | Event, value: number | Event) => {
        console.log(`Accumulator val : ${acc}`);
        if (value instanceof Event) {
          return NaN;
        } else return value;
      })
    );
    clicksOrTimer.subscribe((x) => console.log(`Output from merge : ${x}`));

    //Demo of inbuild and custom operators
    of(...[null, undefined, 20, 15, 10, 5, 6])
      //range(1, 50, asyncScheduler)
      //of(null, 20, 15, 10, 5, 6, 9)
      .pipe(
        //delay(0),
        //tap(val => console.log(`Tapped value ${val}`)),
        debug('test'),
        //filter(value => value !== undefined && value !== null)
        filterNil(),
        take(3)
      )
      .subscribe(
        (item) => console.log(`Rendering Item ${item}`),
        (err) => console.log(err),
        () => console.log('Completed')
      );
  }
}

/**
 * Returns a function which takes an observable as source and returns a new observable
 *
 * The Observable constructor accepts a function with an observer as an argument
 * This function is invoked when a observer subscribes to the observer.
 *
 * Here in this case, when an observer is passed, the nested function will create a new subscriber on
 * the source.
 *
 * The source subscription will call the next, err, and completed of the new observer from its implementation
 *
 * When the observer is closed, the nested subscriber will also be closed.
 */
const filterNil = () => (source: Observable<any>) =>
  new Observable((observer) => {
    return source.subscribe({
      next(value) {
        if (value !== undefined && value !== null) {
          observer.next(value);
          if (observer.closed) {
            this.unsubscribe();
          }
        }
      },
      error(error) {
        observer.error(error);
      },
      complete() {
        observer.complete();
      },
    });
  });

const mapV1 = (fn: Function) => (source: Observable<any>) =>
  new Observable((observer) => {
    return source.subscribe({
      next(value) {
        observer.next(fn(value));
      },
      error(error) {
        observer.error(error);
      },
      complete() {
        observer.complete();
      },
    });
  });

export function debug(tag: String) {
  return tap({
    next(value: any) {
      console.log(
        `%c[${tag}: Next]`,
        'background: #009688; color: #fff; padding: 3px; font-size: 9px;',
        value
      );
    },
    error(error: any) {
      console.log(
        `%[${tag}: Error]`,
        'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;',
        error
      );
    },
    complete() {
      console.log(
        `%c[${tag}]: Complete`,
        'background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;'
      );
    },
  });
}
