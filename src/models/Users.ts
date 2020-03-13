import { types } from 'typed-graphqlify'
import { UserProfileKeys, buildUserProfileQuery, UserProfileOption, UserProfileResult } from './UserProfiles'
import { pick } from '../Utils'
import { EmailKeys } from './Emails'

export const User = {
  id: types.string
}

export type UserType = typeof User 
export type UserKeys = keyof UserType
export type UserResult<
  U extends UserKeys | null,
  UP extends UserProfileKeys | null,
  UP_E extends EmailKeys | null,
> =
  ([U] extends [UserKeys] ? Pick<UserType, U> : {}) &
  ([UP] extends [UserProfileKeys] ? { profile: UserProfileResult<UP, UP_E> } : {})

export type UserOption<UP, E> = {
  profile?: { fields: UP[], with?: UserProfileOption<E> }
}

/**
 * @ignore
 */
export function buildUserQuery<
  U extends UserKeys,
  UP extends UserProfileKeys | null,
  UP_E extends EmailKeys | null,
>(fields: U[], option?: UserOption<UP, UP_E>): UserResult<U, UP, UP_E> {
  const pickedField: any = pick(User, fields)
  const profile = option && option.profile ? {
    profile: buildUserProfileQuery(option.profile.fields as any, option.profile.with || {})
  } : {}
  return { ...pickedField, ...profile }
}