export interface ISitemapEntry {
  slug: string;
  /** ISO 8601 UTC; absent when the API has no reliable date for the resource. */
  updatedAt?: string;
}

export interface ISitemapResponse {
  movies: ISitemapEntry[];
  cinemas: ISitemapEntry[];
  /** Only cities with at least one cinema. */
  cities: ISitemapEntry[];
  genres: ISitemapEntry[];
}
