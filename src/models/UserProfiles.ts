import { types } from 'typed-graphqlify'
import { pick } from '../Utils'
import { EmailKeys, buildEmailsQuery, EmailResult } from './Emails'
import { UserProfileEmailsArgs } from '../generated/graphql'

export const UserProfile = {
  id: types.string,
  firstName: types.string,
  lastName: types.string,
  phoneNumber: types.string
}

export type UserProfileType = typeof UserProfile 
export type UserProfileKeys = keyof UserProfileType
export type UserProfileResult<
  UP extends UserProfileKeys | null,
  E extends EmailKeys | null,
> =
  ([UP] extends [UserProfileKeys] ? Pick<UserProfileType, UP> : {}) &
  ([E] extends [EmailKeys] ? { emails: EmailResult<E> } : {})

export type UserProfileOption<E> = {
  emails?: { fields: E[], args?: UserProfileEmailsArgs }
}

/**
 * @ignore
 */
function resolveOption<
  E extends EmailKeys | null
>(option: UserProfileOption<E>) {
  const emails = option.emails
    ? { emails: buildEmailsQuery(option.emails.fields as any, option.emails.args)}
    : {}
  return { ...emails }
}

/**
 * @ignore
 */
export function buildUserProfileQuery<
  UP extends UserProfileKeys,
  E extends EmailKeys | null
>(fields: UP[], option?: UserProfileOption<E>): UserProfileResult<UP, E> {
  const pickedField = pick(UserProfile, fields)
  const resolvedOption = option ? resolveOption(option) : {} as any
  return { ...pickedField, ...resolvedOption }
}
