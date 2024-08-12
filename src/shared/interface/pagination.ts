export interface Pagination {
  limit: number;
  offset: number;
}

export interface PaginationQuery {
  page?: number;
  size?: number;
}
