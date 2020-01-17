import { types } from 'typed-graphqlify'

export const User = {
  id: types.string
}

export type UserType = typeof User 
export type UserKeys = keyof UserType
export type UserResult<U extends UserKeys | null> =
  ([U] extends [UserKeys] ? Pick<UserType, U> : {})