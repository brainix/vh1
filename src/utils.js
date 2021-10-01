/*---------------------------------------------------------------------------*\
 |  utils.js                                                                 |
\*---------------------------------------------------------------------------*/

export function iOS() {
  // https://stackoverflow.com/a/9039885
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}
