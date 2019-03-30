import { NgxListAbstractControl } from './control';
import { BehaviorSubject } from 'rxjs';
import { NgxList } from '../list';
describe('NgxListAbstractControl', () => {
  let list: NgxList;
  let src$: BehaviorSubject<any[]>;
  let baseListControl: NgxListAbstractControl;
  beforeEach(() => {
    src$ = new BehaviorSubject([]);
    list = new NgxList({src$: src$.asObservable()});
    baseListControl = new NgxListAbstractControl();
    baseListControl.list = list;
  });
  it('should create an instance', () => {
    expect(baseListControl).toBeTruthy();
  });

  describe('ngOnInit and ngOnDestroy', () => {
    it('should sub and unsub from list.results$', () => {
      expect(baseListControl.result).toBe(null);
      baseListControl.ngOnInit();
      expect(baseListControl.result.unfilteredRecordCount).toBe(0);
      src$.next([{foo: 8}]);
      expect(baseListControl.result.unfilteredRecordCount).toBe(1);
      baseListControl.ngOnDestroy();
      src$.next([{foo: 8}, {foo: 3}]);
      expect(baseListControl.result.unfilteredRecordCount).toBe(1);
    });
  });
});
