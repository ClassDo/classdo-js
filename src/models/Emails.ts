import { types, params } from 'typed-graphqlify'
import { pick, preprocessArgs } from '../Utils'
import { Connection } from './Connection'
import { UserProfileEmailsArgs } from '../generated/graphql'

export const Email = {
  id: types.string,
  value: types.string
}

export type EmailType = typeof  Email
export type EmailKeys = keyof EmailType
export type EmailResult<E extends EmailKeys> =
  Pick<EmailType, E>

export type EmailsResult<
  E extends EmailKeys
> = Connection<EmailResult<E>>


/**
 * @ignore
 */
const buildEmailEdge = <T> (email: T) => ({
  node: email,
  cursor: types.string
})

/**
 * @ignore
 */
const buildEmails = <T> (args: UserProfileEmailsArgs | undefined | null, email: T) => {
  const emails = {
    totalCount: types.number,
    pageInfo: {
      hasNextPage: types.boolean,
      hasPreviousPage: types.boolean,
      startCursor: types.optional.string,
      endCursor: types.optional.string
    },
    edges: [buildEmailEdge(email)]
  }
  return args ? params(preprocessArgs(args), emails) : emails
}

/**
 * @ignore
 */
export function buildEmailsQuery<
  E extends EmailKeys
>(fields: E[], args?: UserProfileEmailsArgs | undefined | null): EmailsResult<E> {
  const pickedField = pick(Email, fields)
  return buildEmails(args, pickedField as any)
}
