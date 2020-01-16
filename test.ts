import { Client } from './src/Client'
import { buildViewerQuery } from './src/models/Viewer'

const client = new Client({ apiKey: process.argv[2] })
const src = buildViewerQuery({
  fields: ['id'],
  with: {
    rooms: {
      fields: ['id', 'name'],
      with: {
        organization: { fields: ['id'] },
        members: { fields: ['id'] },
      }
    }
  }
})

client.query<typeof src>(src).then(v => {
  console.log(v.data)
  if (v.data) {
    console.log(v.data.viewer.rooms.edges[0].node.organization.id)
  }
})