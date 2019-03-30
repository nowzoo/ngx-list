import { Component, Input } from '@angular/core';
import { NgxListAbstractSearchControl } from '../../abstract-controls/search-control';

@Component({
  selector: 'ngx-list-bootstrap-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss']
})
export class NgxListBootstrapSearchControlComponent extends NgxListAbstractSearchControl {
  @Input() placeholder = 'Search...';
  @Input() clearLabel = 'Clear';
  @Input() inputId = 'ngx-search-control';
  @Input() bootstrapSize: 'sm' | 'lg' = null;
}
