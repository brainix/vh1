/*---------------------------------------------------------------------------*\
 |  monkey.js                                                                |
 |                                                                           |
 |  Copyright © 2017-2019, Rajiv Bakulesh Shah, original author.             |
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

/* eslint no-extend-native: ["error", {"exceptions": ["String", "Array"]}] */

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.trimAll = function () {
  return this.trim()
    .replace(/\s+/g, ' ');
};

String.prototype.htmlToText = function () {
  return this.replace(/<[^>]*\/?>/g, '')    // HTML open and self-closing tags
    .replace(/<\/[a-z]*>/ig, '')            // HTML close tags
    // eslint-disable-next-line
    .replace(/\&mdash;/ig, '-');
};

Array.prototype.choice = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function () {
  for (let current = this.length - 1; current > 0; current--) {
    const random = Math.floor(Math.random() * (current + 1));
    [this[current], this[random]] = [this[random], this[current]];
  }
  return this;
};
