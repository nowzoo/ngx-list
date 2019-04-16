import { InjectionToken } from '@angular/core';
export interface INgxListBoostrapOptions {
  firstPageButtonTitle?: string;
  firstPageButtonHTML?: string;
  lastPageButtonTitle?: string;
  lastPageButtonHTML?: string;
  prevPageButtonTitle?: string;
  prevPageButtonHTML?: string;
  nextPageButtonTitle?: string;
  nextPageButtonHTML?: string;
  currentPageTitle?: string;
  recordsPerPageOptions?: number[];
  recordsPerPageNoPagingLabel?: string;
  recordsPerPageLabel?: string;
  sortLabel?: string;
  sortDescHTML?: string;
  sortDescLabel?: string;
  sortAscHTML?: string;
  sortAscLabel?: string;
}
export const NGX_LIST_BOOTSTRAP_OPTIONS: InjectionToken<INgxListBoostrapOptions> =
  new InjectionToken<INgxListBoostrapOptions>(
    'labels znd html for the list components'
  );

export const NGX_LIST_BOOTSTRAP_DEFAULT_OPTIONS: INgxListBoostrapOptions = {
  firstPageButtonTitle: 'First Page',
  firstPageButtonHTML: '&larrb;',
  lastPageButtonTitle: 'Last Page',
  lastPageButtonHTML: '&rarrb;',
  prevPageButtonTitle: 'Previous Page',
  prevPageButtonHTML: '&larr;',
  nextPageButtonTitle: 'Next Page',
  nextPageButtonHTML: '&rarr;',
  currentPageTitle: 'Current Page',
  recordsPerPageOptions: [10, 25, 50, 100],
  recordsPerPageNoPagingLabel: 'No paging',
  recordsPerPageLabel: ' per page',
  sortLabel: 'Sort List',
  sortAscHTML: '&darr;',
  sortAscLabel: 'sorted in a-z order',
  sortDescHTML: '&uarr;',
  sortDescLabel: 'sorted in z-a order',
};
