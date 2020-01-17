import { types } from 'typed-graphqlify'

export const UserProfile = {
  id: types.string,
  firstName: types.string,
  lastName: types.string,
  phoneNumber: types.string
}

export type UserProfileType = typeof UserProfile 
export type UserProfileKeys = keyof UserProfileType
export type UserProfileResult<UP extends UserProfileKeys | null> =
  ([UP] extends [UserProfileKeys] ? Pick<UserProfileType, UP> : {})