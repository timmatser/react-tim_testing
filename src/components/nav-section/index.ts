import { matchPath } from 'react-router-dom';

// ----------------------------------------------------------------------

export { default as NavSectionVertical } from './vertical';
export { default as NavSectionHorizontal } from './horizontal';

export function isExternalLink(path: string) {
  return path.includes('http');
}

export function getActive(path: string, pathname: string) {
  // Special case
  if (pathname.startsWith('/dashboard/orders/search')) {
    return path.startsWith('/dashboard/orders/search');
  }
  return path ? !!matchPath({ path: path, end: false }, pathname) : false;
}
