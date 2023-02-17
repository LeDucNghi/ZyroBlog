export interface PaginationParams {
  _limit: number;
  _page: number;
  _total: number;
}

export interface PostListRes<T> {
  data: T[];
}