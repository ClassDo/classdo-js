/**
 * @ignore
 */
export type Connection<T> = {
  totalCount: number,
  pageInfo: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor: string | undefined,
    endCursor: string | undefined
  },
  edges: {
    cursor: string
    node: T
  }[]
}