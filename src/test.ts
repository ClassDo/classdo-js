import { Client } from './Client'
// import { buildViewerQuery } from './models/Viewer'
// import { buildCreateRoomMutation } from './models/Rooms'
// import { buildDeleteRoomMutatoin } from './models/Rooms'
// import { buildAddRoomMembersMutation } from './models/RoomMembers'
// import { buildDeleteRoomMemberMutation } from './models/RoomMembers'
import { buildSendInvitationMutation } from './models/Invitations'
// import { query } from 'typed-graphqlify'
import { mutation } from 'typed-graphqlify'
import gql from 'graphql-tag'
import { Locale, ContactType } from './generated/graphql'


const client = new Client({ apiKey: 'u6SlsOP2Va2iaW5NjBm1I9c1XeLhhJiW36euYc2h' })
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

const sendInvitationSrc = buildSendInvitationMutation(
  { 
    data: {
      roomId: '"ck56jgshb02hg0726ox49by9v"',
      organizationMemberRoleId: '"ck4l8tsem03np0726qp9ynba9"',
      locale: Locale.En,
      contactFullName: '"Masato"',
      contactType: ContactType.Email,
      contactInfo: '"joe.tialtngo@gmail.com"'
    }
  },
  ['id'],
)

console.log(mutation(sendInvitationSrc))
const sendInvitationResult = client.getClient().mutate({ mutation: gql(mutation(sendInvitationSrc)) })
sendInvitationResult.then(v => {
  console.log(v.data)
})