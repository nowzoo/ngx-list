# @nowzoo/ngx-list

Paginated, sorted and filtered lists from observables. The base library is agnostic as to styling and controls; a full set of Bootstrap 4 controls is available as a separate module.



## Quick Start

Install the library and Lodash.

```bash
npm i -S @nowzoo/ngx-list lodash
```

Problem with depending on Lodash? [Read this note](#about-the-lodash-dependency).

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
    this.list = new NgxList({
      src$: this.dataService.data$, //required
      idKey: 'id' //required
    });
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
  "page": 0,
  "recordsPerPage": 10,
  "sort": {
    "key": "id",
    "reversed": false
  },
  "filterValues": {},
  "recordCount": 88,
  "pageCount": 9,
  "unfilteredRecordCount": 88,
  "records": [...]
}
```

At this point, `result.records` is the array of sorted and filtered records from your `src$` observable that belong on the current page.

It's up to you to layout the records, for example in a table...

```html
<table class="table">
  <tbody>
    <tr *ngFor="let record of result.records">
      ...
    </tr>
  </tbody>
</table>
```

#### Setting list params

Note: In the real world you'll probably want to hook the list parameters up to form controls, or use the Bootstrap components.

Set `page`...
```ts
// Go to the second page (page is zero-based.)
this.list.setPage(1);
```

Set `recordsPerPage`...
```ts
this.list.setRecordsPerPage(20);
// show all the records, with no paging...
this.list.setRecordsPerPage(0);
```

Set `sort`...
```ts
this.list.setSort({key: 'firstName', reversed: false});
```

Set a filter value.  Note that you have to actually set up the filter when you instantiate the list. See below.
```ts
this.list.setFilterValue('search' 'foo');
```





## API

#### `class NgxList`

The main class.

##### Constructor
```ts
const list = new NgxList(init);
```

The `NgxList` constructor takes an initializing object. The only required properties of this object are `src$` and `idKey`. All other properties are optional.

- `src$: Observable<any[]>` **Required**. An observable of records from your data source.
- `idKey: string` **Required**. The key of some unique record identifier. This is used as the fallback sort key.
- `page?: number` Optional. The initial page. Default `0`.
- `recordsPerPage?: number` Optional. The initial recordsPerPage. Default `10`.
- `sort?: {key?: string, reversed?: boolean}` Optional. The initial sort params.
  - `key` defaults to whatever you passed as `idKey` (see above)
  - `reversed` defaults to `false`
- `filterValues?: {[filterKey: string]: any}` Optional. The initial values for the filters. For example, you could pass `{search: 'foo'}` if initializing the list from a query param.
- `filters?: {[filterKey: string]: NgxListFilterFn}` Optional. Your filter functions. You can roll your own filter functions or use the factories:
   - `NgxListFnFactory.searchFilter`
   - `NgxListFnFactory.comparisonFilter`.
- `sortFn?: NgxListSortFn` Optional. If nothing is passed, the list creates a sort function with some sensible defaults. You can roll your own sort function, use the [`NgxListFnFactory.sortFn`](#static-sortfnoptions-ngxlistsortfn) factory.


##### Properties
- `result$:  Observable<INgxListResult>` The list result as an observable.
- `result: INgxListResult` The latest list result.

Additionally, the class exposes the individual properties of the latest result:

- `records: any[]` The records that belong on the current page.
- `recordCount: number` The number of records that match the current filters.
- `unfilteredRecordCount: number` The total number of records, before filtering.
- `pageCount: number` The number of pages.
- `page: number` The current page. If there are records, this will be between `0` and `pageCount - 1`.
- `recordsPerPage: number` The value used to page the result.
- `sort: {key: string, reversed: boolean}` The parameters used to sort the list.
- `filterValues: {[key: string]: any}` The filter values used to filter the result.


##### Methods
- `setPage(page: number): void` Set the page number. Note that whatever you pass here will be eventually be constrained to between `0` and `pageCount - 1`.
- `setRecordsPerPage(recordsPerPage: number): void` Pass `0` for no paging.
- `setSort(sort: {key: string, reversed: boolean}): void` Set the sort params. `key` can use dot notation to access nested properties of your records. If `reversed` is true, then the list will be sorted in descending (z-a) order.
- `setFilterValue(key: string, value: any): void` Set the value of a particular filter, e.g. `list.setFilterValue('search', 'foo bar')`

----

#### `class NgxListFnFactory`

A class with static methods for creating filter and sort functions.  

##### `static sortFn(options?): NgxListSortFn`

Creates a sort function. `NgxList` uses this to create the default sort function. You can use this factory to replace the default sort function, or roll your own.

`options` can be an object with the following properties:

- `fallbackSortColumn?: string` Optional. The key to sort by if two records are the same by the current sort key.
- `caseSensitive?: boolean` Optional. Default `false`. If true, record keys containing strings will be sorted case-sensitively.
- `valueFns?: {[key: string]: NgxListColumnValueFn}` Optional. Use this if you want to mess with the values for sorting, or add a sort key that does not exist in your raw records.

##### `static searchFilter(options?): NgxListFilterFn`
Creates a filter to match records by text. Use this to create a search filter top pass to `NgxList`:

```ts
const list = new NgxList({
  src$: myDataSrc$,
  idKey: 'id',
  filters: {
    // using the default options...
    search: NgxListFnFactory.searchFilter()
  }
});
```

`options` can be an object with the following properties:

- `caseSensitive?: boolean` Optional. Default `false`. Set to `true` if you want to match string values  case-sensitively.
- `ignoredKeys?: string[]` Optional. By default the function will search all of the scalar keys in an object, including deeply nested ones. Pass an array of dot-notated keys to ignore single or multiple paths. Note that this is hierarchical: if you pass `['id', 'profile']`, all the keys under profile (e.g. `profile.firstName`) will be ignored as well.
- `valueFns?: {[key: string]: NgxListColumnValueFn}` Optional. Use this if you want to mess with the values before searching (e.g. formatting dates to provide something more meaningful).

##### `static comparisonFilter(options): NgxListFilterFn`

Create a generic filter function to pass to `NgxList`.

```ts
const list = new NgxList({
  src$: myDataSrc$,
  idKey: 'id',
  filters: {
    verified: NgxListFnFactory.comparisonFilter({
      value: (rec) => rec.verified === true
    })
  }
});
```

`options` is an object with the following properties:

- `value: string | NgxListColumnValueFn` **Required**. A dot-notated key pointing to a record value, or (recommended) a function that, given a record, returns a value.
- `compare?: NgxListCompare` Optional. What comparison operator to use. Default `NgxListCompare.eq`.
- `ignoreFilterWhen?: (filterValue: any) => boolean` Optional. By default, the filter will be ignored when the filter value is `null`, `undefined` or an empty string (`''`). If this logic doesn't suit pass your own function here.


----

#### `type NgxListColumnValueFn = (record: any) => any`

A function that, given a record, returns a value for purposes of sorting, search or filtering. Used by the factory functions.

----

#### `type NgxListFilterFn = (records: any[], value: any) => any[]`

The signature of a filter function. You should return a new array of records that match your filter logic. (Don't mutate the array passed in the parameter.)

- `records` contains the unfiltered records.
- `value` is the current filter value.

-----

#### `type NgxListSortFn = (records: any[], key: string) => any[]`

The signature of a sort function. You should return a separate array sorted by your logic. (Don't mutate the array passed in the parameter.)

- `records` are the unsorted records.
- `key` is the sort key.

Note that reversing the list, if necessary, happens separately.

-----

#### `enum NgxListCompare`

Used by the `NgxList.comparisonFilter` factory.
- `eq` Use `===`  to compare values.
- `neq` Use `!==`  to compare values.
- `gte` Use `>=`  to compare values.
- `gt` Use `>`  to compare values.
- `lte` Use `<=`  to compare values.
- `lt` Use `<` to compare values.


----
#### `interface INgxListResult`

The end product of the list.

- `records: any[]` The records that belong on the current page.
- `recordCount: number` The number of records that match the current filters.
- `unfilteredRecordCount: number` The total number of records, before filtering.
- `pageCount: number` The number of pages.
- `page: number` The current page. If there are records, this will be between `0` and `pageCount - 1`.
- `recordsPerPage: number` The value used to page the result.
- `sort: {key: string, reversed: boolean}` The parameters used to sort the list.
- `filterValues: {[key: string]: any}` The filter values used to filter the result.






## Notes

###### About the Lodash dependency
Yeah, yeah, I know you can do everything Lodash does natively. But you can't do it as well or as consistently. So, Lodash.

The library uses a minimal set of Lodash functions, which will add about 7.5kB to the payload of your app, if you don't use other Lodash functions elsewhere. If you do use it elsewhere, make sure to use the following tree-shakeable import syntax:

~~~ts
// good
import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';
// bad
// import * as _ from 'lodash';
// just as bad...
// import { chunk, sortBy } from 'lodash';
~~~

To make this compile for your code, you will probably have to add `"esModuleInterop": true, "allowSyntheticDefaultImports": true`  to `compilerOptions` in `tsconfig.json`. (You don't need to add it if you are not using Lodash elsewhere, only using the `ngx-list` library.)
