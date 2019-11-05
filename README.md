# classdo.js

ClassDo API client for browsers and NodeJS.

## Quick Start

Install via npm

```
npm install classdo
```

Install via yarn

```
yarn add classdo
```

### Making requests

```js
const ClassDoJS = require('classdo-js')
const client = new ClassDoJS.Client({ accessToken: 'xxxxxxxx' })
client.users.getAuthenticated().then(user => {
  // Fetch the current user
  console.log(user)
}).catch(e => {
  console.error(e)
})
```

## APIs

### User

#### Get the authenticated user

```
client.users.getAuthenticated()
```

### Organization

#### Get

```
client.organizations.get(id)
```

#### List your organizations

```
client.organizations.list()
```

##### Parameters

| name     |required|type    |description|
|----------|--------|--------|-----------|
| id       | false  | string | organization id   |
| name     | false  | string | organization name |
| perPage  | false  | number | results per page (max 100) |
| page     | false  | number | page number of the results to fetch |
| ref      | false  | Object | reference for getting related objects |

#### Create new organization

```
client.organizations.create()
```

##### Parameters

TBD

#### Delete your organization

```
client.organizations.delete(id)
```

##### Parameters

TBD

### Room

#### Get

```
client.rooms.get(id)
```

#### List your organizations

```
client.rooms.list()
```

##### Parameters

| name     |required|type    |description|
|----------|--------|--------|-----------|
| id       | false  | string | organization id   |
| name     | false  | string | organization name |
| per_page | false  | number | results per page (max 100) |
| page     | false  | number | page number of the results to fetch |
| ref      | false  | Object | reference for getting related objects |

#### Create new room

```
client.rooms.create()
```

##### Parameters

TBD

#### Delete your room

```
client.rooms.delete(id)
```

##### Parameters

TBD


#### Add room member


```
client.rooms.addMember({ organizationId: 'xxx', roomId: 'xxx', userId: 'xxx' })
```

##### Parameters

| name           |required|type    |description|
|----------------|--------|--------|-----------|
| organizationId | true   | string | organization id   |
| roomId         | true   | string | room id |
| userId         | true   | string | user id   |

> Note: You can add only user that already is in your organization into a room.

#### Delete your room

```
client.rooms.delete(id)
```

##### Parameters

TBD

### Invitation

#### Get invitation list


```
client.invitations.list()
```

##### Parameters

TBD


#### Send invitation

```
client.invitations.send({ organizationId: 'xxx', roomId: 'xxx', email: 'xxx', phoneNumber: 'xxx', inviteeName: 'xxx' })
```

| name           | required | type   | description     |
|----------------|----------|--------|-----------------|
| organizationId | true     | string | organization id |
| roomId         | false    | string | room id         |
| email          | false    | string | email address   |
| phoneNumber    | false    | string | phoneNumber     |
| inviteeName    | true     | string | invitee name    |

> Note: At least you have to specify email or phoneNumber to send invitaion.


#### Accept invitation

```
client.invitations.accept(id)
```

> Limitation: For now you can only accept invitation sended by sms.

> Note: You only can accept invitation sending you.

#### Decline invitation

```
client.invitations.accept(id)
```

> Limitation: For now you can only decline invitation sended by sms.

> Note: You only can decline invitation sending you.
