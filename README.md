# @nowzoo/ngx-list

Paginated, sorted and filtered lists from observables for Angular. The base library is agnostic as to styling and controls; a  set of Bootstrap 4 controls is available as a separately imported module.

[Demo](https://nowzoo.github.io/ngx-list/) | [Demo Code](https://github.com/nowzoo/ngx-list/tree/master/projects/ngx-list-demo/src/app/demo)

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

### Bootstrap Components

The library provides a set of Bootstrap themed components for sorting and pagination.

- `NgxListBoostrapPaginationComponent`: An input group with prev/next and first/last buttons, and a dropdown with page numbers.
- `NgxListBoostrapRppComponent`: A dropdown to set the `recordsPerPage` property of a list.
- `NgxListBootstrapSortComponent`: Sort a list by a key.

To use these components import the module:

```ts
import { NgxListBootstrapModule } from '@nowzoo/ngx-list';
@NgModule({
  imports: [
    NgxListBootstrapModule,
  ]
})
export class MyModule { }
```

#### Component Usage
```ts
// component...
ngOnInit() {
  this.list = new NgxList({src$: mySource, idKey: 'id'})
}
```
```html

<!-- pagination... -->
<ngx-list-bootstrap-pagination
  [list]="list"></ngx-list-bootstrap-pagination>

<!-- rpp... -->
<ngx-list-bootstrap-rpp
  [list]="list"></ngx-list-bootstrap-rpp>


<!-- sort components as table headers... -->
<table class="table">
  <thead>
    <tr>
      <th>
        <ngx-list-bootstrap-sort
          [list]="list"
          key="id">ID</ngx-list-bootstrap-sort>
      </th>
      <th>
        <ngx-list-bootstrap-sort
        [list]="list"
        key="name">Name</ngx-list-bootstrap-sort>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let record of list.records">
      ...
    </tr>
  </tbody>
</table>
```

See the [Bootstrap Components API](#bootstrap-components-api) for more options.

## API

### NgxList

The main class.

```ts
const list = new NgxList(init);
```

The `NgxList` constructor takes an initializing object in the shape of `INgxListInit`. The only required properties are `src$` and `idKey`. All other properties are optional.

#### Interface INgxListInit

- `src$: Observable<any[]>` **Required**. An observable of records from your data source.
- `idKey: string` **Required**. The key of some unique record identifier. This is used as the fallback sort key.
- `page?: number` Optional. The initial page. Default `0`.
- `recordsPerPage?: number` Optional. The initial recordsPerPage. Default `10`.
- `sort?: {key?: string, reversed?: boolean}` Optional. The initial sort params.
  - `key` defaults to whatever you passed as `idKey` (see above)
  - `reversed` defaults to `false`
- `filterValues?: {[filterKey: string]: any}` Optional. The initial values for the filters. For example, you could pass `{search: 'foo'}` if initializing the list from a query param.
- `filters?: {[filterKey: string]: NgxListFilterFn}` Optional. A map of filter functions. You can roll your own [NgxListFilterFn](#type-ngxlistfilterfn) or use the factories:
   - [`NgxListFnFactory.searchFilter`](#ngxlistfnfactorysearchfilter)
   - [`NgxListFnFactory.comparisonFilter`](#ngxlistfnfactorycomparisonfilter).
- `sortFn?: NgxListSortFn` Optional. If nothing is passed, the list creates a sort function with some sensible defaults. You can roll your own function of type [NgxListSortFn](#type-ngxlistsortfn), use the [`NgxListFnFactory.sortFn`](#ngxlistfnfactorysortfn) factory.


#### NgxList Properties
- `result$:  Observable<INgxListResult>` The list result as an observable. See [INgxListResult](#interface-ingxlistresult).
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


#### NgxList Methods
- `setPage(page: number): void` Set the page number. Note that whatever you pass here will be eventually be constrained to between `0` and `pageCount - 1`.
- `setRecordsPerPage(recordsPerPage: number): void` Pass `0` for no paging.
- `setSort(sort: {key: string, reversed: boolean}): void` Set the sort params. `key` can use dot notation to access nested properties of your records. If `reversed` is true, then the list will be sorted in descending (z-a) order.
- `setFilterValue(key: string, value: any): void` Set the value of a particular filter, e.g. `list.setFilterValue('search', 'foo bar')`


### NgxListFnFactory

A class with static methods for creating filter and sort functions.  

#### NgxListFnFactory.sortFn

Static method to create a sort function of type [NgxListSortFn](#type-ngxlistsortfn). `NgxList` uses this to create the default sort function. You can use this factory to replace the default sort function, or roll your own.

`static sortFn(options?): NgxListSortFn`

`options` can be an object with the following properties:

- `fallbackSortColumn?: string` Optional. The key to sort by if two records are the same by the current sort key.
- `caseSensitive?: boolean` Optional. Default `false`. If true, record keys containing strings will be sorted case-sensitively.
- `valueFns?: {[key: string]: NgxListColumnValueFn}` Optional. Use this if you want to mess with the values for sorting, or add a sort key that does not exist in your raw records.

#### NgxListFnFactory.searchFilter

Static method to create a search filter of type [NgxListFilterFn](#type-ngxlistfilterfn). Use this to create a search filter top pass to `NgxList`:

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
`static searchFilter(options?): NgxListFilterFn`

`options` can be an object with the following properties:

- `caseSensitive?: boolean` Optional. Default `false`. Set to `true` if you want to match string values  case-sensitively.
- `ignoredKeys?: string[]` Optional. By default the function will search all of the scalar keys in an object, including deeply nested ones. Pass an array of dot-notated keys to ignore single or multiple paths. Note that this is hierarchical: if you pass `['id', 'profile']`, all the keys under profile (e.g. `profile.firstName`) will be ignored as well.
- `valueFns?: {[key: string]: NgxListColumnValueFn}` Optional. Use this if you want to mess with the values before searching (e.g. formatting dates to provide something more meaningful). Pass a map from dot-notated key to [NgxListColumnValueFn](#type-ngxlistcolumnvaluefn)

#### NgxListFnFactory.comparisonFilter

Create a generic filter function of type [NgxListFilterFn](#type-ngxlistfilterfn)

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

`static comparisonFilter(options): NgxListFilterFn`.

`options` is an object with the following properties:

- `value: string | NgxListColumnValueFn` **Required**. A dot-notated key pointing to a record value, or (recommended) a function that, given a record, returns a value.
- `compare?: NgxListCompare` Optional. See [NgxListCompare](#enum-ngxlistcompare).What comparison operator to use. Default `NgxListCompare.eq`.
- `ignoreFilterWhen?: (filterValue: any) => boolean` Optional. By default, the filter will be ignored when the filter value is `null`, `undefined` or an empty string (`''`). If this logic doesn't suit pass your own function here.



### type NgxListColumnValueFn

`type NgxListColumnValueFn = (record: any) => any`

A function that, given a record, returns a value for purposes of sorting, search or filtering. Used by the factory functions.


### type NgxListFilterFn

`type NgxListFilterFn = (records: any[], value: any) => any[]`

The signature of a filter function. You should return a new array of records that match your filter logic. (Don't mutate the array passed in the parameter.)

- `records` contains the unfiltered records.
- `value` is the current filter value.


### type NgxListSortFn  

The signature of a sort function. You should return a separate array sorted by your logic. (Don't mutate the array passed in the parameter.)

`type NgxListSortFn = (records: any[], key: string) => any[]`

- `records` are the unsorted records.
- `key` is the sort key.

Note that reversing the list, if necessary, happens separately.


### enum NgxListCompare

Used by the [`NgxList.comparisonFilter`](#ngxlistfnfactorycomparisonfilter) factory.


`enum NgxListCompare`

- `eq` Use `===`  to compare values.
- `neq` Use `!==`  to compare values.
- `gte` Use `>=`  to compare values.
- `gt` Use `>`  to compare values.
- `lte` Use `<=`  to compare values.
- `lt` Use `<` to compare values.



### interface INgxListResult

The end product of the list.

`interface INgxListResult`

- `records: any[]` The records that belong on the current page.
- `recordCount: number` The number of records that match the current filters.
- `unfilteredRecordCount: number` The total number of records, before filtering.
- `pageCount: number` The number of pages.
- `page: number` The current page. If there are records, this will be between `0` and `pageCount - 1`.
- `recordsPerPage: number` The value used to page the result.
- `sort: {key: string, reversed: boolean}` The parameters used to sort the list.
- `filterValues: {[key: string]: any}` The filter values used to filter the result.


## Bootstrap Components API

### NgxListBootstrapModule

#### Exports
 - [NgxListBoostrapPaginationComponent](#NgxListBoostrapPaginationComponent)
 - [NgxListBoostrapRppComponent](#NgxListBoostrapRppComponent)
 - [NgxListBootstrapSortComponent](#NgxListBootstrapSortComponent)


### NgxListBoostrapPaginationComponent
An input group with prev/next and first/last buttons, and a dropdown with page numbers.

`selector: 'ngx-list-bootstrap-pagination'`

##### Inputs
 - `list: NgxList` Required. The list.
 - `selectId: string` Required. The id you want to be attached to the page dropdown.
 - `buttonClass: string` Optional. The Boostrap button class. Default: `'btn btn-outline-secondary'`.
 - `bootstrapSize: 'sm' | 'lg'` Optional. The Bootstrap size for the input group. Default: `null`.
 - `options: INgxListBoostrapOptions` Optional. Default: `null`. Pass options for this instance. Will override whatever was `provide`d for `NGX_LIST_BOOTSTRAP_OPTIONS` in the module or component.


### NgxListBoostrapRppComponent

A dropdown to set the `recordsPerPage` of a list.

`selector: 'ngx-list-bootstrap-rpp'`

#### Inputs
 - `list: NgxList` Required. The list.
 - `selectId: string` Required. The id you want to be attached to the dropdown.
 - `bootstrapSize: 'sm' | 'lg'` Optional. The Bootstrap size for the select. Default: `null`.
 - `options: INgxListBoostrapOptions` Optional. Default: `null`. Pass options for this instance. Will override whatever was `provide`d for `NGX_LIST_BOOTSTRAP_OPTIONS` in the module or component. See [INgxListBoostrapOptions](#interface-ingxlistboostrapoptions)


### NgxListBoostrapSortComponent

A sort link with indicators, sutable for use in table headers.

`selector: 'ngx-list-bootstrap-sort'`

#### Inputs
 - `list: NgxList` Required. The list.
 - `key: string` Required. The dot-notated key of the column to sort by.
 - `defaultReversed: boolean` Optional. Whether the sort should be in reverse order when the key is selected. (Note that selecting the key when it is already selected toggles `reversed`.  Default: `false`.
 - `options: INgxListBoostrapOptions` Optional. Default: `null`. Pass options for this instance. Will override whatever was `provide`d for `NGX_LIST_BOOTSTRAP_OPTIONS` in the module or component.


### interface INgxListBoostrapOptions

Options to control language, markup, etc. for the bootstrap components. Pass them directly to the components as inputs, or use the [`NGX_LIST_BOOTSTRAP_OPTIONS` token](#const-ngx_list_bootstrap_options) to provide your default options.


- `firstPageButtonTitle?: string` Optional. Default: `'First Page'`. Used for `title` and `aria-label`.
- `firstPageButtonHTML?: string` Optional. Default: &larrb; (`'&larrb;'`). The `innerHTML` of the button.
- `lastPageButtonTitle?: string` Optional. Default: `'Last Page'`. Used for `title` and `aria-label`.
- `lastPageButtonHTML?: string`  Optional. Default: &rarrb; (`'&rarrb;'`). The `innerHTML` of the button.
- `prevPageButtonTitle?: string`  Optional. Default: `'Previous Page'`. Used for `title` and `aria-label`.
- `prevPageButtonHTML?: string`  Optional. Default: &larr; (`'&larr;'`). The `innerHTML` of the button.
- `nextPageButtonTitle?: string` Optional. Default: `'Next Page'`. Used for `title` and `aria-label`.
- `nextPageButtonHTML?: string` Optional. Default: &rarr; (`'&rarr;'`). The `innerHTML` of the button.
- `currentPageTitle?: string` Optional. Default: `'Current Page'`. Used as the `title` and `aria-label` of the pagination dropdown.
- `recordsPerPageOptions?: number[]` Optional. The options for the rpp component. Default: `[10, 25, 50, 100]`
- `recordsPerPageNoPagingLabel?: string` Optional. The label for the 'no paging option'. Default: `'No paging'`. Note that this will only have effect if you pass `0` as one of the `recordsPerPageOptions`.
- `recordsPerPageLabel?: string` Optional. Default: `' per page'`. Inserted after the number in each option of the recordsPerPage dropdown.
- `sortLabel?: string` Optional. Default: `'Sort List'`. Used as the `title` and `aria-label` for sort components.
- `sortDescHTML?: string` Optional. Default:  &uarr; (`'&uarr;'`). The html to be used as the indicator when the sort component is selected and the the list is sorted in descending order (reversed).
- `sortDescLabel?: string`  Optional. Default:  `'sorted in z-a order'`. Screen reader text to be used when the sort component is selected and the the list is sorted in descending order (reversed).
- `sortAscHTML?: string` Optional. Default:  &darr; (`'&darr;'`). The html to be used as the indicator when the sort component is selected and the the list is sorted in ascending order (not reversed).
- `sortAscLabel?: string`  Optional. Default:  `'sorted in a-z order'`. Screen reader text to be used when the sort component is selected and the the list is sorted in ascending order (not reversed).


### const NGX_LIST_BOOTSTRAP_OPTIONS

`const NGX_LIST_BOOTSTRAP_OPTIONS: InjectionToken<INgxListBoostrapOptions>`

Use this to set some or all of the component options, either in a module or in a component. You don't have to provide all the options; the options you provide will override the defaults. Example:

```ts
import {
  NgxListBootstrapModule,
  NGX_LIST_BOOTSTRAP_OPTIONS,
  INgxListBoostrapOptions
} from '@nowzoo/ngx-list';

// let's  use font awesome icons
const myOptions: INgxListBoostrapOptions = {
  firstPageButtonHTML: '<i class="fas fa-arrow-to-left"></i>',
  lastPageButtonHTML: '<i class="fas fa-arrow-to-right"></i>',
  prevPageButtonHTML: '<i class="fas fa-arrow-left"></i>',
  nextPageButtonHTML: '<i class="fas fa-arrow-right"></i>',
  sortAscHTML: '<i class="fas fa-arrow-down"></i>',
  sortDescHTML: '<i class="fas fa-arrow-up"></i>',
};

@NgModule({
  imports: [
    NgxListBootstrapModule,
  ],
  providers: [
    {provide: NGX_LIST_BOOTSTRAP_OPTIONS, useValue: myOptions}
  ]
})
export class MyModule { }
```

## Notes

### About the Lodash dependency
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
