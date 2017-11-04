/*---------------------------------------------------------------------------*\
 |  monkey.test.js                                                           |
 |                                                                           |
 |  Copyright © 2017, Rajiv Bakulesh Shah, original author.                  |
 |                                                                           |
 |      This program is free software: you can redistribute it and/or modify |
 |      it under the terms of the GNU General Public License as published by |
 |      the Free Software Foundation, either version 3 of the License, or    |
 |      (at your option) any later version.                                  |
 |                                                                           |
 |      This program is distributed in the hope that it will be useful, but  |
 |      WITHOUT ANY WARRANTY; without even the implied warranty of           |
 |      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU    |
 |      General Public License for more details.                             |
 |                                                                           |
 |      You should have received a copy of the GNU General Public License    |
 |      along with this program.  If not, see:                               |
 |          <http://www.gnu.org/licenses/>                                   |
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
