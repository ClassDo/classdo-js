import express from 'express'

import { ClassDoAPIClient } from '../../src'
import { createHash } from 'crypto'
import { IncomingHttpHeaders } from 'http'
import { ContactType, Locale } from '../../src/generated/graphql'

const API_KEY = process.env.API_KEY
const client = new ClassDoAPIClient({ apiKey: API_KEY })

const app = express()
app.use(express.json())

const port = 3000

// NOTE: need to implement own authorization way
function createAccessToken (email: string) {
  const sha512 = createHash('sha512')
  sha512.update(email)
  return sha512.digest('hex')
}
const users: { email: string, accessToken: string }[] = []

function signup(email: string) {
  const accessToken = createAccessToken(email)
  users.push({ email, accessToken })
  return accessToken
} 

async function authorize(headers: IncomingHttpHeaders) {
  const authorizationHeader = headers.authorization
  const token = authorizationHeader ? authorizationHeader.split(' ')[1] : ''
  const user = users.find(v => v.accessToken === token)
  if (!user) {
    throw new Error('invalid access token')
  }
  const args = {
    input: {
      where: { user: { profile: { emails_some: { value: user.email } } } }
    }
  }
  const orgMembers = await client.organizationMembers.list(['id'], args, {
    user: { fields: ['id'] }
  })
  if (orgMembers.errors) {
    throw new Error(orgMembers.errors.join(','))
  }
  if (orgMembers.data.edges.length === 0) {
    throw new Error('not found orgMember')
  }
  return orgMembers.data.edges[0].node
}

app.get('/api/signup', (req, res) => {
  res.json({ access_token: signup(req.query.email) })
})

app.get('/api/organization', async (req, res) => {
  const result = await client.viewer.get(['id', 'name'])
  if (result.errors) {
    throw new Error('failed to fetch organization')
  }
  return res.json(result.data)
})

app.get('/api/rooms', async (req, res) => {
  const orgMember = await authorize(req.headers)
  const result = await client.rooms.list(['id', 'name'], {
    input: {
      where: {
        members_some: { user: { id: orgMember.user.id } }
      }
    },
  }, {
    members: {
      fields: ['id'],
      with: {
        user: {
          fields: ['id'],
          with: {
            profile: {
              fields: ['firstName', 'lastName'],
              with: { emails: { fields: ['id', 'value'] } }
            }
          }
        }
      }
    }
  })
  if (result.errors) {
    throw new Error('failed to fetch organization')
  }
  res.json(result.data.edges.map(v => {
    return { ...v.node, members: v.node.members.edges.map(v => v.node) }
  }))
})

app.post('/api/room', async (req, res) => {
  const orgMember = await authorize(req.headers)
  const result = await client.rooms.create(['id'], {
    data: { name: req.body.name, description: '' }
  })
  await client.roomMembers.create(['id'], { data: { roomId: result.data.id, userIds: [orgMember.user.id] }})
  res.json(result.data)
})

app.post('/api/invite', async (req, res) => {
  const roles = await client.roles.list(['id'])
  const result = await client.invitatoins.send(['id'], {
    data: {
      contactType: ContactType.Email,
      contactInfo: req.body.email,
      contactFullName: req.body.name,
      roomId: req.body.roomId,
      locale: Locale.En,
      organizationMemberRoleId: roles.data.edges[0].node.id
    }
  })
  res.json(result.data)
})

app.get('/api/billing', async (req, res) => {
  const billing = await client.billing.get(
    ['id', 'month', 'year'],
    { input: { year: Number(req.query.year), month: Number(req.query.month) } },
    {
      records: {
        fields: ['id', 'date'],
        with: {
          usages: {
            fields: ['paidSec', 'amount', 'ledgerType'],
            with: {
              user: {
                fields: ['id'], with: { profile: { fields: ['firstName'] } }
              },
              room: { fields: ['name'] }
            }
          },
          freeCredits: { fields: ['paidSec', 'amount', 'ledgerType']},
          topups: { fields: ['paidSec', 'amount', 'ledgerType']},
        }
      }
    }
  )
  res.json(billing.data)
})

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
})