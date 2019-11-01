/**
 * @ignore
 */
export function compareGraphqlQuery(actual: string, expected: string) {
  expect(actual.replace(/\s/gi, '')).toEqual(expected.replace(/\s/gi, ''))
}