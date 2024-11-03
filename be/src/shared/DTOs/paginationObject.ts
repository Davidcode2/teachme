export default class PaginationObject {
  pageSize: number;
  offset: number;
  limit: number;

  constructor(pageSize: number, offset: number, limit: number) {
    this.pageSize = pageSize;
    this.offset = offset;
    this.limit = limit;
  }
}
