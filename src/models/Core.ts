export function pick <M extends Object, F extends keyof M> (model: M, fields: F[] | null) {
  if (!fields) {
    return {}
  }
  return fields.reduce((p, c) => {
    p[c] = model[c]
    return p
  }, {} as Pick<M, F>)
}