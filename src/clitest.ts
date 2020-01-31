import { ClassDoAPIClient } from './clients'
// import { buildViewerQuery } from './models/Viewer'
// import { buildCreateRoomMutation } from './models/Rooms'
// import { buildDeleteRoomMutatoin } from './models/Rooms'
// import { buildDeleteRoomMemberMutation } from './models/RoomMembers'
// import { buildSendInvitationMutation } from './models/Invitations'
// import { query } from 'typed-graphqlify'
// import { Locale, ContactType } from './generated/graphql'


const client = new ClassDoAPIClient({ apiKey: 'UUmX32COyNBZEeRSgjUV8YGYyhQwCuM5zLEhCwc0' })

const result = client.viewer.get(['id'], { rooms: { fields: ['id', 'name'] }})
result.then(v => {
  console.log(v)
  if (v.data) {
    console.log(v.data.rooms.edges[0].node.name)
  }
})
// const result = client.organizationMembers.list(['id'])
// result.then(v => {
//   console.log(v.data?.edges[0].node)
// })
// 
// const member = client.organizationMembers.get(['id'], 'ck4l8tsef03nn0726825k3k9t')
// member.then(v => {
//   console.log(v.data?.id)
// })

// client.rooms.list(['id']).then(async v => {
//   const roomId = v.data?.edges[0].node.id || ''
//   const userId = (await client.organizationMembers.list(
//     ['id'], null, { user: { fields: ['id']}})).data?.edges[1].node.user.id || ''
//   const result = await client.roomMembers.create(['id'], { data: { roomId, userIds: [userId] }})
//   console.log(result)
// })
// client.roomMembers.delete(['id'], { id: 'ck5nf5s271vye0726s37iaxfw' }).then(v => {
//   console.log(v)
// })
// client.roomMembers.list(['id'], 'ck56jgshb02hg0726ox49by9v').then(v => {
//   console.log(v.data?.edges)
// })
// client.roomMembers.get(['id'], 'ck56jgsk902ht0726ydrm3owk').then(v => {
//   console.log(v)
// })
// client.invitatoins.send(['id'], {
//   data: {
//     contactFullName: 'joe',
//     contactType: ContactType.Email,
//     contactInfo: 'joe.tialtngo@gmail.com',
//     organizationMemberRoleId: 'ck4l8tsem03np0726qp9ynba9',
//     roomId: 'ck56jgshb02hg0726ox49by9v',
//     locale: Locale.Ja
//   }
// }).then(v => {
//   console.log(v)
// })


// client.roomMembers.create(['id'], { data: { roomId: ''}})

// const rooms = client.rooms.list(['id'], null, { organization: { fields: ['id'] }})
// rooms.then(v => {
//   if (v.data) {
//     console.log(v.data.edges[0].node)
//   }
// })
// 
// const room = client.rooms.get(['id'], 'ck56jgshb02hg0726ox49by9v')
// room.then(v => {
//   console.log(v)
// })
// 
// const roles = client.roles.list(['id'])
// roles.then(v => {
//   if (v.data) {
//     console.log(v.data.edges[0].node)
//   }
// })
// 
// const role = client.roles.get(['id'], 'ck4l8tsem03np0726qp9ynba9')
// role.then(v => {
//   if (v.data) {
//     console.log(v.data)
//   }
// })

// const createdRoom = client.rooms.create(['id'], { data: {
//   name: 'createdRoom',
//   description: 'description'
// }})
// createdRoom.then(v => {
//   console.log(v)
// })
// const deletedRoom = client.rooms.delete(['id'], { id: 'ck5qkevfj2tmk0726bo13iol8' })
// deletedRoom.then(v => {
//   console.log(v)
// })

// const rolesResult = client.roles(['id', 'name'])
// rolesResult.then(v => {
//   console.log(v.errors)
//   if (v.data) {
//     console.log(v.data.edges[0])
//   }
// })
// const resultRooms = client.rooms(['id'])
// resultRooms.then(v => {
//   if (v.data) {
//     console.log(v.data.edges[0].node)
//   }
// })
// const resultMembers = client.organizationMembers(['id'], null, { user: { fields: ['id'], with: { profile: { fields: ['firstName']}}}})
// resultMembers.then(v => {
//   if (v.data) {
//     console.log(v.data.edges[0].node)
//   }
// })
// 
// const src = buildViewerQuery(['id'], {
//   rooms: {
//     fields: ['id', 'name'],
//     with: {
//       organization: { fields: ['id', 'name'] },
//       members: {
//         fields: ['id'],
//         with: {
//           user: {
//             fields: ['id'],
//             with: {
//               profile: { fields: ['id', 'firstName'] }
//             }
//           }
//         }
//       }
//     }
//   },
//   members: {
//     args: {
//       input: { where: { user: { profile: { firstName_contains: '"Masa"' } } } }
//     },
//     fields: ['id'],
//     with: {
//       user: {
//         fields: ['id'],
//         with: {
//           profile: {
//             fields: ['id', 'firstName']
//           }
//         }
//       },
//       role: {
//         fields: ['name']
//       }
//     }
//   },
//   roles: {
//     fields: ['name']
//   }
// })
// src.viewer.rooms.edges[0].node.organization.id
// src.viewer.rooms.edges[0].node.organization.name
// src.viewer.rooms.edges[0].node.members.edges[0].node.id
// src.viewer.rooms.edges[0].node.members.edges[0].node
// // src.viewer.members.edges[0].node.user.id
// // src.viewer.rooms.edges[0].node.organization.description
// 
// console.log(query(src))
// const result = client.getClient().query<typeof src>({ query: gql(query(src))})
// console.log(result)
// result.then(v => {
//   console.log(v.data)
//   if (v.data) {
//     console.log(v.data.viewer.rooms.edges[0].node)
//     console.log(v.data.viewer.rooms.edges[0].node.members.edges)
//     console.log(v.data.viewer.rooms.edges[0].node.members.edges[0].node.user)
//     console.log(v.data.viewer.rooms.edges[0].node.members.edges[0].node.user.profile)
//     console.log(v.data.viewer)
//     console.log(v.data.viewer.members.edges[0].node.user)
//     console.log(v.data.viewer.roles.edges[0])
//     console.log(v.data.viewer.members.edges[0].node.role)
//   }
// })

// const deleteRoomSrc = buildDeleteRoomMutatoin(
//   { id: '"ck5mcmzw712qs07264hpi8wnm"' },
//   ['id', 'name']
// )
// console.log(deleteRoomSrc)
// console.log(mutation(deleteRoomSrc))
// const createRoomResult = client.getClient().mutate({ mutation: gql(mutation(deleteRoomSrc)) })
// createRoomResult.then(v => {
//   console.log(v.data)
// })
// 
// const deleteRoomMemberSrc = buildDeleteRoomMemberMutation(
//   { id: '"ck5m6lvym11ac0726uzamur2a"' },
//   ['id']
// )
// 
// console.log(mutation(deleteRoomMemberSrc))
// const deleteRoomMemberResult = client.getClient().mutate({ mutation: gql(mutation(deleteRoomMemberSrc)) })
// deleteRoomMemberResult.then(v => {
//   console.log(v.data)
// })

// const addRoomMemberSrc = buildAddRoomMembersMutation(
//   { data: { roomId: 'ck56jgshb02hg0726ox49by9v', userIds: ['ck5m6lgp4118n0726h5pmnbpk'] } },
//   ['id']
// )

// console.log(mutation(addRoomMemberSrc))
// const addRoomMemberResult = client.getClient().mutate({ mutation: gql(mutation(addRoomMemberSrc)) })
// addRoomMemberResult.then(v => {
//   console.log(v.data)
// })

// const sendInvitationSrc = buildSendInvitationMutation(
//   { 
//     data: {
//       roomId: '"ck56jgshb02hg0726ox49by9v"',
//       organizationMemberRoleId: '"ck4l8tsem03np0726qp9ynba9"',
//       locale: Locale.En,
//       contactFullName: '"Masato"',
//       contactType: ContactType.Email,
//       contactInfo: '"joe.tialtngo@gmail.com"'
//     }
//   },
//   ['id'],
// )
// 
// console.log(mutation(sendInvitationSrc))
// const sendInvitationResult = client.mutate(sendInvitationSrc)
// sendInvitationResult.then(v => {
//   console.log(v.datak
// })