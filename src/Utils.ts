export function pick <M extends Object, F extends keyof M> (model: M, fields: F[] | null) {
  if (!fields) {
    return {}
  }
  return fields.reduce((p, c) => {
    p[c] = model[c]
    return p
  }, {} as Pick<M, F>)
}

export function preprocessArgs (args: Object): any {
  function process (value: any): any {
    switch(typeof value) {
      case 'boolean':
      case 'number':
      case 'bigint':
        return value
      case 'string':
        return `"${value}"`
      case 'object':
        if (Array.isArray(value)) {
          return `[${value.map(process).toString()}]`
        }
        if (value !== null) {
          return Object.keys(value).reduce((p, key) => {
             p[key] = process(value[key])
             return p
          }, {} as {[key: string]: any})
        }
        throw new Error(`not expected args: ${value}`)
    }
  }
  return process(args)
}