# @nowzoo/ngx-list

Paginated, sorted and filtered lists from observables. The base library is agnostic as to styling and controls; a full set of Bootstrap 4 controls is available as a separate module.



## Quick Start

Install the library and Lodash.
```bash
npm i -S @nowzoo/ngx-list lodash
```

Problem with depending on Lodash? [Read the note](#about-the-lodash-dependency).

If you are planning on using the Bootstrap 4 components, you need to include Bootstrap css somewhere in your build process. None of the Bootstrap components depend on Bootstrap javascript.

### Basic Usage

The base library does not expose any components or services, so there's no module to import. There's just the `NgxList` class that you import and instantiate in your component code...

```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxList, NgxListResult } from '@nowzoo/ngx-list';
import { MyDataService } from '../my-data.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styles: []
})
export class DemoComponent implements OnInit, OnDestroy {
  list: NgxList;
  result: NgxListResult = null;

  constructor(
    private dataService: MyDataService
  ) { }

  ngOnInit() {
    // assuming dataService.data$ is an observable
    // of an array of records
    this.list = new NgxList({src$: this.dataService.data$});
    this.list.results$.subscribe(result => this.result = result);
  }

  ngOnDestroy() {
    this.list.destroy();
  }
}
```
```html
<!-- demo.component.html -->
<pre>{{result | json}}</pre>
```
Result:
```json
{
  "records": [
    {"name": "Mary"}, {"name": "Jane"},
  ],
  "page": 0,
  "pageCount": 1,
  "recordCount": 2,
  "unfilteredRecordCount": 2,
  "recordsPerPage": 10,
  "sortColumn": null,
  "sortReversed": false,
  "filterParams": {}
}
```

The following examples assumes your list records follow this structure:
```ts
interface SockRecord {
  id: number;
  firstName: string,
  lastName: string,
  purchased: {
    date: number; // ms since the epoch
    price: number;
  },
  color: string;
  missing: 'left' | 'right' | null;
  lastWorn: number; // ms since the epoch
  currentValue: number;
}
```

### Implementing a comparison filter
Let's say we want to have a dropdown that allows the user to filter socks by purchase price.
```ts
// sock-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NgxList, NgxListFilters, NgxListResult } from '@nowzoo/ngx-list';
import { DataService, SockRecord } from '../data.service';

// Let's create an enum here to keep track of
// the filter value and display the options in the menu.
enum ValueOptions {
  lessThan10 = 'less than $10',
  from10to25 = '$10 to $24.99',
  from25to50 = '$25 to $49.99',
  from50to100 = '$50 to $99.99',
  moreThan100 = 'more than $100',
}
export class SockListComponent implements OnInit, OnDestroy {
  list: NgxList;
  result: NgxListResult = null;
  // expose the enum to the template...
  valueOptions = Object.values(ValueOptions);
  // form control for the filter dropdown..
  purchasePriceSelect: FormControl;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.list = new NgxList({
      src$: this.dataService.socks$,
      filters: [
        // use the factory function...
        NgxListFilters.comparisonFilter({
          filterKey: 'purchasePrice',
          // pass a function that takes a record and returns one of the options...
          value: (rec) => {
            const value: number = rec.purchased && rec.purchased.price ? rec.purchased.price : 0;
            if (value >= 100) {
              return ValueOptions.moreThan100;
            }
            if (value >= 50) {
              return ValueOptions.from50to100;
            }
            if (value >= 25) {
              return ValueOptions.from25to50;
            }
            if (value >= 10) {
              return ValueOptions.from10to25;
            }
            return ValueOptions.lessThan10;
          }
        })
      ]
    });
    this.list.results$.subscribe(result => this.result = result);
    // create the form control, and listen for changes...
    this.purchasePriceSelect = new FormControl('');
    this.purchasePriceSelect.subscribe(value => this.list.setFilterParam('purchasePrice', value));
  }
  ngOnDestroy() {
    this.list.destroy();
  }
}
```
The template...
```html
<!-- sock-list.component.html -->
<div class="form-group">
  <label for="purchasePriceSelect">Filter By Purchase Price</label>
  <select class="form-control" [formControl]="purchasePriceSelect" id="purchasePriceSelect">
    <option value="">All Price Ranges</option>
    <option *ngFor="let opt of valueOptions">{{opt}}</option>
  </select>
</div>
<div *ngIf="result">
  <div *ngIf="result.listParams.purchasePrice">
    You filtered by purchase price: {{result.listParams.purchasePrice}}.
    <button class="btn btn-sm btn-link" type="button" (click)="purchasePriceSelect.setValue('')">Clear</button>
  </div>
  <table>
    ...
  </table>
</div>
```




## Notes

###### About the Lodash dependency
Yeah, yeah, I know you can do everything Lodash does natively. But you can't do it as well or as consistently. So, Lodash.

The library uses a minimal set of Lodash functions, which will add about 7.5kB to the payload of your app, if you don't use other Lodash functions elsewhere. If you do use it elsewhere, make sure to use the following tree-shakeable import syntax:

```ts
// good
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';
// bad
// import * as _ from 'lodash';
// just as bad...
// import { chunk, sortBy } from 'lodash';
```

To make this compile for your code, you will probably have to add `"esModuleInterop": true, "allowSyntheticDefaultImports": true`  to `compilerOptions` in `tsconfig.json`. (You don't need to add it if you are not using Lodash elsewhere, only using the `ngx-list` library.)
