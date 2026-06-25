import test from 'ava';
import { fizzBuzz } from './fizzbuzz.js';

test('it returns fizz on multiples of 3', (t) => {
  const result = fizzBuzz(12);
  t.is(result, 'fizz');
});

test('it returns buzz on multiples of 5', (t) => {
  const result = fizzBuzz(10);
  t.is(result, 'buzz');
});

test('it returns fizzbuzz on multiples of 3 and 5', (t) => {
  const result = fizzBuzz(15);
  t.is(result, 'fizzbuzz');
});

test('it returns the number if it is not a multiple of 3 or 5', (t) => {
  const result = fizzBuzz(7);
  t.is(result, 7);
});
