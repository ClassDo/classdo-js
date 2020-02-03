import { ClassDoAPIClient } from './clients'
import {
  Locale,
  ContactType,
  InvitationStatus,
  OrganizationMemberOrderByInput,
  OrganizationMemberRoleOrderByInput,
  PermissionAction,
  RoomMemberOrderByInput,
  RoomOrderByInput
} from './generated/graphql'

const Enum = {
  Locale,
  ContactType,
  InvitationStatus,
  OrganizationMemberOrderByInput,
  OrganizationMemberRoleOrderByInput,
  PermissionAction,
  RoomMemberOrderByInput,
  RoomOrderByInput
}
export { ClassDoAPIClient, Enum }