import { Component } from '@angular/core';
import { LoggerService } from 'my-lib';

@Component({
  selector: 'anand-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'test';

  constructor(logger: LoggerService) {
    logger.log('Hello Angular!!!');
  }
}
