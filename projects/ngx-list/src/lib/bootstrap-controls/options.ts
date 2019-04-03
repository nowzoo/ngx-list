import { InjectionToken } from '@angular/core';
export interface NgxListPaginationLabels {
  firstTitle?: string;
  firstHTML?: string;
  lastTitle?: string;
  lastHTML?: string;
  prevTitle?: string;
  prevHTML?: string;
  nextTitle?: string;
  nextHTML?: string;
  currentTitle?: string;
}
export const NGX_LIST_PAGINATION_LABELS = new InjectionToken<NgxListPaginationLabels>(
  'labels for the pagination component'
);

export const ngxListPaginationLabels: NgxListPaginationLabels = {
  firstTitle: 'First Page',
  firstHTML: '<span class="text-nowrap">|&lt</span>',
  lastTitle: 'Last Page',
  lastHTML: '<span class="text-nowrap">&gt;|</span>',
  prevTitle: 'Previous Page',
  prevHTML: '&lt;',
  nextTitle: 'Next Page',
  nextHTML: '&gt;',
  currentTitle: 'Current Page',
};
