import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Scene, DefaultEventParams, RefinedEventPathname } from 'types';

function createTrackingToken() {
  const secret = 'secret';
  const storageKey = 'trackingToken';
  let trackingToken = localStorage.getItem(storageKey) || '';
  try {
    jwt.verify(trackingToken, '');
  } catch (error) {
    console.error(`[createTrackingSessionId] Error occur when verifys the jwt token: ${error}`);
    trackingToken = jwt.sign(
      {
        sessionID: v4(),
      },
      secret,
      // Expire after 1 month.
      { expiresIn: 60 * 60 * 24 * 30 },
    );
    localStorage.setItem(storageKey, trackingToken);
  }
  return trackingToken;
}

export function createScene(): Scene {
  const { title } = window.document;
  const { hostname, pathname } = window.location;
  return { title, hostname, pathname };
}

export function refineEventPathname(pathname: string): RefinedEventPathname {
  const slashCount = pathname.match(/-/g)?.length;
  if (!slashCount) return { eventId: '', codename: '' };
  if (slashCount === 1 || slashCount === 2) return { eventId: '', codename: pathname };
  // slashCount === 3+
  const pathnameArray = pathname.split('-');
  const eventId = pathnameArray[0];
  const codename = pathnameArray.splice(1, pathnameArray.length).join('-');
  return { eventId, codename };
}

export function createDefaultEventParams(): DefaultEventParams {
  const codenameArray = window.location.pathname.split('/');
  const eventPathname = codenameArray.length > 1 ? codenameArray[1] : '';
  const { eventId, codename } = refineEventPathname(eventPathname);
  const trackingToken = createTrackingToken();

  return {
    userId: sessionStorage.getItem('userID') || 'guest',
    lang: navigator.language || '',
    os: navigator.userAgent || '',
    timestamp: Date.now(),
    codename,
    eventId,
    gaSessionId: trackingToken,
  };
}
