import { buildInvitationQuery, buildSendInvitationMutation } from './Invitations'
import { ContactType, Locale } from '../generated/graphql'
import { mutation, query } from 'typed-graphqlify'
import { compareGraphqlQuery } from '../TestUtils'

describe('buildInvitationQuery', () => {
  it('should build a query', () => {
    const result = buildInvitationQuery(['id', 'contactFullName'])
    compareGraphqlQuery(query(result),`
      query {
        id
        contactFullName
      }
    `)
  })
})

describe('#buildSendInvitationMutation', () => {
  it('should build a query', () => {
      const result = buildSendInvitationMutation(
        ['id', 'contactFullName'], {
          data: {
            contactFullName: 'invitee',
            contactType: ContactType.Email,
            contactInfo: 'example@test.com',
            locale: Locale.En,
            organizationMemberRoleId: 'role1',
            roomId: 'room1'
          }
        }
      )
      compareGraphqlQuery(mutation(result),`
        mutation {
          sendInvitation(data: {
            contactFullName: "invitee",
            contactType: Email,
            contactInfo: "example@test.com",
            locale: En,
            organizationMemberRoleId: "role1",
            roomId: "room1"
          }) {
            id
            contactFullName
          }
        }
      `)
  })
})