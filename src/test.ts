import { Client } from './Client'
import { buildViewerQuery } from './models/Viewer'
import { query } from 'typed-graphqlify'
import gql from 'graphql-tag'


const client = new Client({ apiKey: 'u6SlsOP2Va2iaW5NjBm1I9c1XeLhhJiW36euYc2h' })
const src = buildViewerQuery(['id'], {
  rooms: {
    fields: ['id', 'name'],
    with: {
      organization: { fields: ['id', 'name'] },
      members: {
        fields: ['id'],
        with: { user: { fields: ['id'] } }
      }
    }
  }
})
src.viewer.rooms.edges[0].node.organization.id
src.viewer.rooms.edges[0].node.organization.name
src.viewer.rooms.edges[0].node.members.edges[0].node.id
src.viewer.rooms.edges[0].node.members.edges[0].node
// src.viewer.rooms.edges[0].node.organization.description

const result = client.getClient().query<typeof src>({ query: gql(query(src))})
console.log(result)
result.then(v => {
  console.log(v.data)
  if (v.data) {
    console.log(v.data.viewer.rooms.edges[0].node)
    console.log(v.data.viewer.rooms.edges[0].node.members.edges)
    console.log(v.data.viewer.rooms.edges[0].node.members.edges[0].node.user)
  }
})
