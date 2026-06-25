/**
 *
 * @param {number} n
 */
export function fizzBuzz(n) {
  const result = [];
  if (n % 3 === 0) result.push('fizz');
  if (n % 5 === 0) result.push('buzz');
  if (result.length === 0) return n;
  return result.join('');
}
