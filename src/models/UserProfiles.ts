import { types } from 'typed-graphqlify'
import { pick } from '../Utils'

export const UserProfile = {
  id: types.string,
  firstName: types.string,
  lastName: types.string,
  phoneNumber: types.string
}

export type UserProfileType = typeof UserProfile 
export type UserProfileKeys = keyof UserProfileType
export type UserProfileResult<UP extends UserProfileKeys> =
  Pick<UserProfileType, UP>

  /**
 * @ignore
 */
export function buildUserProfileQuery<
  UP extends UserProfileKeys
>(fields: UP[]): UserProfileResult<UP> {
  const pickedField = pick(UserProfile, fields)
  return pickedField
}
