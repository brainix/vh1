/*---------------------------------------------------------------------------*\
 |  monkey.js                                                                |
\*---------------------------------------------------------------------------*/

/* eslint no-extend-native: ["error", {"exceptions": ["String", "Array"]}] */

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.trimAll = function () {
  return this.trim()
    .replace(/\s+/g, ' ');
};

String.prototype.normalize = function () {
  return this.trimAll()
    .toLowerCase();
};

String.prototype.htmlToText = function () {
  return this.replace(/<[^>]*\/?>/g, '')    // HTML open and self-closing tags
    .replace(/<\/[a-z]*>/ig, '')            // HTML close tags
    // eslint-disable-next-line
    .replace(/\&mdash;/ig, '-')
    .replace(/\&[lr]squo;/ig, "'")
    .replace(/\&[lr]dquo;/ig, '"')
    .replace(/\&hellip;/ig, '...');
};

String.prototype.textToHtml = function () {
  return this.replace(/(\W)-+(\W)/g, '$1&mdash;$2')
    .replace(/'/g, '&rsquo;')
    .replace(/"(.*)"/g, '&ldquo;$1&rdquo;')
    .replace(/\.{3}/g, '&hellip;');
}

String.prototype.cleanName = function () {
  return this.replace(/\([^()]*\)|\[[^[\]]*\]|\{[^{}]*\}/g, '')
    .textToHtml();
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
