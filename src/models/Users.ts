import { types } from 'typed-graphqlify'
import { UserProfileKeys, UserProfileType, buildUserProfileQuery } from './UserProfiles'
import { pick } from '../Utils'

export const User = {
  id: types.string
}

export type UserType = typeof User 
export type UserKeys = keyof UserType
export type UserResult<
  U extends UserKeys | null,
  UP extends UserProfileKeys | null
> =
  ([U] extends [UserKeys] ? Pick<UserType, U> : {}) &
  ([UP] extends [UserProfileKeys] ? { profile: Pick<UserProfileType, UP> } : {})
  // ([UP] extends [UserProfileKeys] ? Pick<UserProfileType, UP> : {})

export type UserOption<UP> = {
  profile?: { fields: UP[] }
}

/**
 * @ignore
 */
export function buildUserQuery<
  U extends UserKeys,
  UP extends UserProfileKeys | null
>(fields: U[], option?: UserOption<UP>): UserResult<U, UP> {
  const pickedField: any = pick(User, fields)
  const profile = option && option.profile ? {
    profile: buildUserProfileQuery(option.profile.fields as any)
  } : {}
  return { ...pickedField, ...profile }
}