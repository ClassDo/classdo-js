import { Params } from 'typed-graphqlify/dist/render'

/**
 * @ignore
 */
export function pick <M extends {}, F extends keyof M> (model: M, fields: F[] | null): Pick<M, F> {
  if (!fields) {
    return {} as Pick<M, F>
  }
  return fields.reduce((p, c) => {
    p[c] = model[c]
    return p
  }, {} as Pick<M, F>)
}

/**
 * @ignore
 */
export function preprocessArgs (args: { [key: string]: any }): Params {
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
             if (['contactType', 'locale', 'orderBy'].includes(key)) {
               // for enum type don't do anything.
               p[key] = value[key]
               return p
             }
             p[key] = process(value[key])
             return p
          }, {} as {[key: string]: any})
        }
        throw new Error(`not expected args: ${value}`)
    }
  }
  return process(args)
}
