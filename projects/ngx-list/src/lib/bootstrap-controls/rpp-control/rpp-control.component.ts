import { Component, Input } from '@angular/core';
import { NgxListAbstractRppControl } from '../../abstract-controls/rpp-control';

@Component({
  selector: 'ngx-list-bootstrap-rpp-control',
  templateUrl: './rpp-control.component.html',
  styleUrls: ['./rpp-control.component.css']
})
export class  NgxListBootstrapRppControlComponent extends NgxListAbstractRppControl {
  @Input() options: number[] = [];
  @Input() noPagingLabel = 'Show All (no paging)';
  @Input() perPageLabel = ' per page';
  @Input() inputId = 'ngx-rpp-control';
  @Input() bootstrapSize: 'sm' | 'lg' = null;
}
