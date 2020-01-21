export function compareGraphqlQuery(expected: string, actual: string) {
  expect(expected.replace(/\s/gi, '')).toEqual(actual.replace(/\s/gi, ''))
}