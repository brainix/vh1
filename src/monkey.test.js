/*---------------------------------------------------------------------------*\
 |  monkey.test.js                                                           |
\*---------------------------------------------------------------------------*/

import './monkey';

it('capitalizes strings correctly', () => {
  expect(''.capitalize()).toBe('');
  expect('raj'.capitalize()).toBe('Raj');
  expect('Raj'.capitalize()).toBe('Raj');
  expect('RAJ'.capitalize()).toBe('RAJ');
});

it('trims strings correctly', () => {
  expect(''.trimAll()).toBe('');
  expect('Raj Shah'.trimAll()).toBe('Raj Shah');
  expect(' Raj  Shah '.trimAll()).toBe('Raj Shah');
});

it('chooses a random element from an array', () => {
  expect([].choice()).toBe(undefined);
  expect([0].choice()).toBe(0);

  Math.random = jest.fn()
    .mockImplementationOnce(() => 0)
    .mockImplementationOnce(() => 0.25)
    .mockImplementationOnce(() => 0.5)
    .mockImplementationOnce(() => 0.75);
  expect([0, 1, 2, 3].choice()).toBe(0);
  expect([0, 1, 2, 3].choice()).toBe(1);
  expect([0, 1, 2, 3].choice()).toBe(2);
  expect([0, 1, 2, 3].choice()).toBe(3);
});
