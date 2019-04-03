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
