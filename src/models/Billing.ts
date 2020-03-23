import { types, params } from 'typed-graphqlify'
import { pick, preprocessArgs } from '../Utils'
import { ViewerBillingArgs } from '../generated/graphql'
import { UserKeys, UserResult, UserOption, buildUserQuery } from './Users'
import { RoomKeys, RoomResult, buildRoomQuery } from './Rooms'
import { UserProfileKeys } from './UserProfiles'
import { EmailKeys } from './Emails'

export const UsageLedger = {
  id: types.string,
  ledgerType: types.string,
  paidSec: types.number,
  timestamp: types.string,
  amount: types.number
}
export type UsageLedgerType = typeof UsageLedger
export type UsageLedgerKeys = keyof UsageLedgerType
export type UsageLedgerResult<
  UL extends UsageLedgerKeys,
  U extends UserKeys | null = null,
  U_P extends UserProfileKeys | null = null,
  U_P_E extends EmailKeys | null = null,
  R extends RoomKeys | null = null
  > =
    Pick<UsageLedgerType, UL> &
    ([U] extends [UserKeys] ? { user: UserResult<U, U_P, U_P_E> } : {}) &
    ([R] extends [RoomKeys] ? { room: RoomResult<R> } : {})
export type UsageLedgerOption<U, U_P, U_P_E, R> = {
  user?: { fields: U[], with?: UserOption<U_P, U_P_E> },
  room?: { fields: R[] }
}

export const BillingRecord = {
  id: types.string,
  date: types.string
}
export type BillingRecordType = typeof BillingRecord
export type BillingRecordKeys = keyof BillingRecordType
export type BillingRecordResult<
  BR extends BillingRecordKeys,
  UL extends UsageLedgerKeys | null,
  UL_U extends UserKeys | null,
  UL_U_P extends UserProfileKeys | null,
  UL_U_P_E extends EmailKeys | null,
  UL_R extends RoomKeys | null,
  FUL extends UsageLedgerKeys | null,
  TUL extends UsageLedgerKeys | null
> =
  Pick<BillingRecordType, BR> &
  ([UL] extends [UsageLedgerKeys] ? { usages: UsageLedgerResult<UL, UL_U, UL_U_P, UL_U_P_E, UL_R>[] } : {}) &
  ([FUL] extends [UsageLedgerKeys] ? { freeCredits: UsageLedgerResult<FUL>[] } : {}) &
  ([TUL] extends [UsageLedgerKeys] ? { topups: UsageLedgerResult<TUL>[] } : {})
export type BillingRecordOption<
  UL, UL_U, UL_U_P, UL_U_P_E, UL_R,
  FUL,
  TUL
> = {
  usages?: { fields: UL[], with?: UsageLedgerOption<UL_U, UL_U_P, UL_U_P_E, UL_R> },
  freeCredits?: { fields: FUL[] },
  topups?: { fields: TUL[] }
}

export const Billing = {
  id: types.string,
  year: types.number,
  month: types.number
}
export type BillingType = typeof Billing
export type BillingKeys = keyof BillingType
export type BillingResult<
  B extends BillingKeys,
  BR extends BillingRecordKeys | null,
  BR_UL extends UsageLedgerKeys | null,
  BR_UL_U extends UserKeys | null,
  BR_UL_U_P extends UserProfileKeys | null,
  BR_UL_U_P_E extends EmailKeys | null,
  BR_UL_R extends RoomKeys | null,
  BR_FUL extends UsageLedgerKeys | null,
  BR_TUL extends UsageLedgerKeys | null
> =
  Pick<BillingType, B> &
  ([BR] extends [BillingRecordKeys] ? {
    records: BillingRecordResult<
      BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL
    >[]
  } : {})

export type BillingOption<
  BR,
  BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R,
  BR_FUL,
  BR_TUL
> = {
  records?: { fields: BR[], with?: BillingRecordOption<BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL> }
}

/**
 * @ignore
 */
function resolveUsageLedgerOption<
  U extends UserKeys | null,
  U_P extends UserProfileKeys | null,
  U_P_E extends EmailKeys | null,
  R extends RoomKeys | null,
>(option: UsageLedgerOption<U, U_P, U_P_E, R>) {
  const user = option.user
    ? { user: buildUserQuery(option.user.fields as any, option.user.with)}
    : {}
  const room = option.room
    ? { room: buildRoomQuery(option.room.fields as any) }
    : {}
  return { ...user, ...room }
}

/**
 * @ignore
 */
function buildUsageLedgerQuery<
  UL extends UsageLedgerKeys,
  U extends UserKeys | null = null,
  U_P extends UserProfileKeys | null = null,
  U_P_E extends EmailKeys | null = null,
  R extends RoomKeys | null = null,
>(
  fields: UL[],
  option?: UsageLedgerOption<U, U_P, U_P_E, R>
): UsageLedgerResult<UL, U, U_P, U_P_E, R> {
  const pickedField = pick(UsageLedger, fields)
  const resolvedOption = option ? resolveUsageLedgerOption(option) : {} as any
  return { ...pickedField, ...resolvedOption }
}

/**
 * 
 * @ignore
 */
function resolveBillingRecordOption<
  UL extends UsageLedgerKeys | null,
  UL_U extends UserKeys | null,
  UL_U_P extends UserProfileKeys | null,
  UL_U_P_E extends EmailKeys | null,
  UL_R extends RoomKeys | null,
  FUL extends UsageLedgerKeys | null,
  TUL extends UsageLedgerKeys | null
>(option: BillingRecordOption<UL, UL_U, UL_U_P, UL_U_P_E, UL_R, FUL, TUL>) {
  const usages = option.usages
    ? { usages: buildUsageLedgerQuery(option.usages.fields as any, option.usages.with)}
    : {}
  const freeCredits = option.freeCredits
    ? { freeCredits: buildUsageLedgerQuery(option.freeCredits.fields as any)}
    : {}
  const topups = option.topups
    ? { topups: buildUsageLedgerQuery(option.topups.fields as any)}
    : {}
  return { ...usages, ...freeCredits, ...topups }
}

/**
 * @ignore
 */
function buildBillingRecordQuery<
  BR extends BillingRecordKeys,
  UL extends UsageLedgerKeys | null,
  UL_U extends UserKeys | null,
  UL_U_P extends UserProfileKeys | null,
  UL_U_P_E extends EmailKeys | null,
  UL_R extends RoomKeys | null,
  FUL extends UsageLedgerKeys | null,
  TUL extends UsageLedgerKeys | null
>(
  fields: BR[],
  option?: BillingRecordOption<UL, UL_U, UL_U_P, UL_U_P_E, UL_R, FUL, TUL>
): BillingRecordResult<BR, UL, UL_U, UL_U_P, UL_U_P_E, UL_R, FUL, TUL> {
  const pickedField = pick(BillingRecord, fields)
  const resolvedOption = option ? resolveBillingRecordOption(option) : {} as any
  return { ...pickedField, ...resolvedOption }
}

/**
 * @ignore
 */
function resolveBillingOption<
  BR extends BillingRecordKeys | null,
  BR_UL extends UsageLedgerKeys | null,
  BR_UL_U extends UserKeys | null,
  BR_UL_U_P extends UserProfileKeys | null,
  BR_UL_U_P_E extends EmailKeys | null,
  BR_UL_R extends RoomKeys | null,
  BR_FUL extends UsageLedgerKeys | null,
  BR_TUL extends UsageLedgerKeys | null
>(option: BillingOption<BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL>) {
  const records = option.records
    ? { records: buildBillingRecordQuery(option.records.fields as any, option.records.with) }
    : {}
  return { ...records }
}

export function buildBillingQuery<
  B extends BillingKeys,
  BR extends BillingRecordKeys | null,
  BR_UL extends UsageLedgerKeys | null,
  BR_UL_U extends UserKeys | null,
  BR_UL_U_P extends UserProfileKeys | null,
  BR_UL_U_P_E extends EmailKeys | null,
  BR_UL_R extends RoomKeys | null,
  BR_FUL extends UsageLedgerKeys | null,
  BR_TUL extends UsageLedgerKeys | null
>(
  fields: B[],
  args: ViewerBillingArgs,
  option?: BillingOption<BR, BR_UL, BR_UL_U, BR_UL_U_P, BR_UL_U_P_E, BR_UL_R, BR_FUL, BR_TUL>
) {
  const pickedField = pick(Billing, fields)
  const resolvedOption = option ? resolveBillingOption(option) : {} as any
  return params(preprocessArgs(args), { ...pickedField, ...resolvedOption })
}