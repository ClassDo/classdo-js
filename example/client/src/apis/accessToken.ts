class AccessToken {
  set(accessToken: string) {
    localStorage.setItem('access_token', accessToken)
  }
  get() {
    return localStorage.getItem('access_token')
  }
}

export default new AccessToken()