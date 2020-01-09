export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export enum ContactType {
  PhoneNumber = 'PhoneNumber',
  Email = 'Email'
}

export type Invitation = {
   __typename?: 'Invitation',
  id: Scalars['ID'],
  contactType: ContactType,
  contactInfo: Scalars['String'],
  contactFullName: Scalars['String'],
  status: InvitationStatus,
  room?: Maybe<Room>,
  organization: Organization,
};

export type InvitationsSendInput = {
  contactInfo: Scalars['String'],
  contactType: ContactType,
  contactFullName: Scalars['String'],
  organizationMemberRoleId: Scalars['String'],
  roomId: Scalars['ID'],
};

export enum InvitationStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined'
}

export type IOrganization = {
  id: Scalars['ID'],
  name: Scalars['String'],
  owner: User,
  logoImageUrl?: Maybe<Scalars['String']>,
  members: OrganizationMembers,
  rooms: Rooms,
  roles: OrganizationMemberRoles,
};

export type Mutation = {
   __typename?: 'Mutation',
  createRoom: Room,
  deleteRoom: Room,
  addRoomMembers: Array<RoomMember>,
  deleteRoomMember: RoomMember,
  sendInvitation: Invitation,
};


export type MutationCreateRoomArgs = {
  data: RoomCreateInput
};


export type MutationDeleteRoomArgs = {
  id: Scalars['ID']
};


export type MutationAddRoomMembersArgs = {
  data: RoomMembersAddInput
};


export type MutationDeleteRoomMemberArgs = {
  id: Scalars['ID']
};


export type MutationSendInvitationArgs = {
  data: InvitationsSendInput
};

export type Organization = IOrganization & {
   __typename?: 'Organization',
  id: Scalars['ID'],
  name: Scalars['String'],
  owner: User,
  logoImageUrl?: Maybe<Scalars['String']>,
  members: OrganizationMembers,
  rooms: Rooms,
  roles: OrganizationMemberRoles,
};


export type OrganizationMembersArgs = {
  input?: Maybe<OrganizationMembersInput>
};


export type OrganizationRoomsArgs = {
  input?: Maybe<RoomsInput>
};


export type OrganizationRolesArgs = {
  input?: Maybe<RolesInput>
};

export type OrganizationMember = {
   __typename?: 'OrganizationMember',
  id: Scalars['ID'],
  organization: Organization,
  user?: Maybe<User>,
  role?: Maybe<OrganizationMemberRole>,
};

export type OrganizationMemberEdge = {
   __typename?: 'OrganizationMemberEdge',
  node: OrganizationMember,
  cursor: Scalars['String'],
};

export enum OrganizationMemberOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type OrganizationMemberRole = {
   __typename?: 'OrganizationMemberRole',
  id: Scalars['ID'],
  name: Scalars['String'],
  permissions: Array<Permission>,
  members: Array<OrganizationMember>,
};

export type OrganizationMemberRoleEdge = {
   __typename?: 'OrganizationMemberRoleEdge',
  node: OrganizationMemberRole,
  cursor: Scalars['String'],
};

export enum OrganizationMemberRoleOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type OrganizationMemberRoles = {
   __typename?: 'OrganizationMemberRoles',
  totalCount: Scalars['Int'],
  pageInfo: PageInfo,
  edges: Array<OrganizationMemberRoleEdge>,
};

export type OrganizationMemberRoleWhereInput = {
  AND?: Maybe<Array<OrganizationMemberRoleWhereInput>>,
  OR?: Maybe<Array<OrganizationMemberRoleWhereInput>>,
  NOT?: Maybe<Array<OrganizationMemberRoleWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_lt?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
};

export type OrganizationMembers = {
   __typename?: 'OrganizationMembers',
  totalCount: Scalars['Int'],
  pageInfo: PageInfo,
  edges: Array<OrganizationMemberEdge>,
};

export type OrganizationMembersInput = {
  where?: Maybe<OrganizationMemberWhereInput>,
  orderBy?: Maybe<OrganizationMemberOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
};

export type OrganizationMemberWhereInput = {
  AND?: Maybe<Array<OrganizationMemberWhereInput>>,
  OR?: Maybe<Array<OrganizationMemberWhereInput>>,
  NOT?: Maybe<Array<OrganizationMemberWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  user?: Maybe<UserWhereInput>,
  role?: Maybe<OrganizationMemberRoleWhereInput>,
};

export type PageInfo = {
   __typename?: 'PageInfo',
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
  startCursor?: Maybe<Scalars['String']>,
  endCursor?: Maybe<Scalars['String']>,
};

export type Permission = {
   __typename?: 'Permission',
  id: Scalars['ID'],
  action: PermissionAction,
  role: OrganizationMemberRole,
};

export enum PermissionAction {
  OrganizationEdit = 'Organization_Edit',
  OrganizationDelete = 'Organization_Delete',
  OrganizationMembersShow = 'OrganizationMembers_Show',
  OrganizationMemberRolesEdit = 'OrganizationMemberRoles_Edit',
  BillingEdit = 'Billing_Edit',
  RoomsCreate = 'Rooms_Create',
  RoomsEdit = 'Rooms_Edit',
  RoomsDelete = 'Rooms_Delete',
  VideochatActivate = 'Videochat_Activate',
  VideochatToggleRemoteAudio = 'Videochat_ToggleRemoteAudio',
  VideochatToggleRemoteVideo = 'Videochat_ToggleRemoteVideo',
  RoomStatusBePresenter = 'RoomStatus_BePresenter',
  RoomRecordingsCreate = 'RoomRecordings_Create',
  RoomRecordingsShow = 'RoomRecordings_Show',
  RoomMembersDelete = 'RoomMembers_Delete',
  RoomMembersInviteContacts = 'RoomMembers_InviteContacts',
  RoomMembersInviteOrganizationMembers = 'RoomMembers_InviteOrganizationMembers',
  RoomMembersInviteQuickJoin = 'RoomMembers_InviteQuickJoin',
  ApiKeyManagement = 'APIKey_Management'
}

export type Query = {
   __typename?: 'Query',
  viewer?: Maybe<Viewer>,
};

export type RolesInput = {
  where?: Maybe<OrganizationMemberRoleWhereInput>,
  orderBy?: Maybe<OrganizationMemberRoleOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
};

export type Room = {
   __typename?: 'Room',
  id: Scalars['ID'],
  name: Scalars['String'],
  description: Scalars['String'],
  organization: Organization,
  members: Array<RoomMember>,
};

export type RoomCreateInput = {
  name: Scalars['String'],
  description: Scalars['String'],
};

export type RoomEdge = {
   __typename?: 'RoomEdge',
  node: Room,
  cursor: Scalars['String'],
};

export type RoomMember = {
   __typename?: 'RoomMember',
  id: Scalars['ID'],
  user: User,
  room: Room,
};

export type RoomMemberEdge = {
   __typename?: 'RoomMemberEdge',
  node: RoomMember,
  cursor: Scalars['String'],
};

export type RoomMembers = {
   __typename?: 'RoomMembers',
  totalCount: Scalars['Int'],
  pageInfo: PageInfo,
  edges: Array<RoomMemberEdge>,
};

export type RoomMembersAddInput = {
  roomId: Scalars['ID'],
  userIds: Array<Scalars['ID']>,
};

export type RoomMemberWhereInput = {
  AND?: Maybe<Array<RoomMemberWhereInput>>,
  OR?: Maybe<Array<RoomMemberWhereInput>>,
  NOT?: Maybe<Array<RoomMemberWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  room?: Maybe<RoomWhereInput>,
  user?: Maybe<UserWhereInput>,
};

export enum RoomOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ArchivedAtAsc = 'archivedAt_ASC',
  ArchivedAtDesc = 'archivedAt_DESC',
  OldIdAsc = 'oldId_ASC',
  OldIdDesc = 'oldId_DESC'
}

export type Rooms = {
   __typename?: 'Rooms',
  totalCount: Scalars['Int'],
  pageInfo: PageInfo,
  edges: Array<RoomEdge>,
};

export type RoomsInput = {
  where?: Maybe<RoomWhereInput>,
  orderBy?: Maybe<RoomOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
};

export type RoomWhereInput = {
  AND?: Maybe<Array<RoomWhereInput>>,
  OR?: Maybe<Array<RoomWhereInput>>,
  NOT?: Maybe<Array<RoomWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_lt?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  description_not?: Maybe<Scalars['String']>,
  description_in?: Maybe<Array<Scalars['String']>>,
  description_not_in?: Maybe<Array<Scalars['String']>>,
  description_lt?: Maybe<Scalars['String']>,
  description_lte?: Maybe<Scalars['String']>,
  description_gt?: Maybe<Scalars['String']>,
  description_gte?: Maybe<Scalars['String']>,
  description_contains?: Maybe<Scalars['String']>,
  description_not_contains?: Maybe<Scalars['String']>,
  description_starts_with?: Maybe<Scalars['String']>,
  description_not_starts_with?: Maybe<Scalars['String']>,
  description_ends_with?: Maybe<Scalars['String']>,
  description_not_ends_with?: Maybe<Scalars['String']>,
  members_every?: Maybe<RoomMemberWhereInput>,
  members_some?: Maybe<RoomMemberWhereInput>,
  members_none?: Maybe<RoomMemberWhereInput>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  profile: UserProfile,
};

export type UserProfile = {
   __typename?: 'UserProfile',
  id: Scalars['ID'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  phoneNumber: Scalars['String'],
};

export type UserProfileWhereInput = {
  AND?: Maybe<Array<UserProfileWhereInput>>,
  OR?: Maybe<Array<UserProfileWhereInput>>,
  NOT?: Maybe<Array<UserProfileWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  firstName?: Maybe<Scalars['String']>,
  firstName_not?: Maybe<Scalars['String']>,
  firstName_in?: Maybe<Array<Scalars['String']>>,
  firstName_not_in?: Maybe<Array<Scalars['String']>>,
  firstName_lt?: Maybe<Scalars['String']>,
  firstName_lte?: Maybe<Scalars['String']>,
  firstName_gt?: Maybe<Scalars['String']>,
  firstName_gte?: Maybe<Scalars['String']>,
  firstName_contains?: Maybe<Scalars['String']>,
  firstName_not_contains?: Maybe<Scalars['String']>,
  firstName_starts_with?: Maybe<Scalars['String']>,
  firstName_not_starts_with?: Maybe<Scalars['String']>,
  firstName_ends_with?: Maybe<Scalars['String']>,
  firstName_not_ends_with?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  lastName_not?: Maybe<Scalars['String']>,
  lastName_in?: Maybe<Array<Scalars['String']>>,
  lastName_not_in?: Maybe<Array<Scalars['String']>>,
  lastName_lt?: Maybe<Scalars['String']>,
  lastName_lte?: Maybe<Scalars['String']>,
  lastName_gt?: Maybe<Scalars['String']>,
  lastName_gte?: Maybe<Scalars['String']>,
  lastName_contains?: Maybe<Scalars['String']>,
  lastName_not_contains?: Maybe<Scalars['String']>,
  lastName_starts_with?: Maybe<Scalars['String']>,
  lastName_not_starts_with?: Maybe<Scalars['String']>,
  lastName_ends_with?: Maybe<Scalars['String']>,
  lastName_not_ends_with?: Maybe<Scalars['String']>,
  user?: Maybe<UserWhereInput>,
};

export type UserWhereInput = {
  AND?: Maybe<Array<UserWhereInput>>,
  OR?: Maybe<Array<UserWhereInput>>,
  NOT?: Maybe<Array<UserWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  profile?: Maybe<UserProfileWhereInput>,
};

export type Viewer = IOrganization & {
   __typename?: 'Viewer',
  id: Scalars['ID'],
  name: Scalars['String'],
  owner: User,
  logoImageUrl?: Maybe<Scalars['String']>,
  members: OrganizationMembers,
  rooms: Rooms,
  roles: OrganizationMemberRoles,
};


export type ViewerMembersArgs = {
  input?: Maybe<OrganizationMembersInput>
};


export type ViewerRoomsArgs = {
  input?: Maybe<RoomsInput>
};


export type ViewerRolesArgs = {
  input?: Maybe<RolesInput>
};
