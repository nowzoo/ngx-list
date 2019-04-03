import { NgxListAbstractSortLink } from './sort-link';
import { NgxListResult } from '../shared';
describe('NgxListAbstractSortLink', () => {
  it('should create an instance', () => {
    expect(new NgxListAbstractSortLink()).toBeTruthy();
  });

  describe('onClick(event)', () => {
    let event: any;
    let list: any;
    let result: NgxListResult;
    let sortLink: NgxListAbstractSortLink;
    beforeEach(() => {
      event = {preventDefault: jasmine.createSpy()};
      list = {setSort: jasmine.createSpy()};
      result = {filterParams: {}, page: 0, pageCount: 1, records: [{foo: 8}], recordsPerPage: 10,
        sortColumn: 'id', sortReversed: false, unfilteredRecordCount: 1};
      sortLink = new NgxListAbstractSortLink();
      sortLink.columnKey = 'foo';
      sortLink.defaultReversed = false;
      sortLink.list = list;
    });
    it('should call event.preventDefault if event is present', () => {
      sortLink.onClick(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
    it('should not call event.preventDefault if event is not present', () => {
      sortLink.onClick();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
    it('should call list.setSort with defaultReversed if it is not the current column', () => {
      sortLink.result = result;
      sortLink.onClick(event);
      expect(list.setSort).toHaveBeenCalledWith('foo', false);
    });
    it('should call list.setSort with the opposite of sortReversed if it is the current column', () => {
      result.sortColumn = 'foo';
      sortLink.result = result;
      sortLink.onClick(event);
      expect(list.setSort).toHaveBeenCalledWith('foo', true);
      result.sortColumn = 'foo';
      result.sortReversed = true;
      sortLink.onClick(event);
      expect(list.setSort).toHaveBeenCalledWith('foo', false);
    });
  });
});
