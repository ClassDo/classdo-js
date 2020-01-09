process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// const url = process.env.KUBERNETES
//   ? 'http://server.dev-capella.svc.cluster.local:4000/graphql'
//   : process.env.NODE_ENV !== 'production' && !process.env.CI
//   ? 'https://graphqlapi.classdo.localhost/graphql'
//   : 'https://graphqlapi.classdo.com/graphql'

const url = 'https://api.classdo.localhost:9001/graphql'


module.exports = {
  client: {
    service: {
      name: 'classdo',
      url
    }
  }
}
