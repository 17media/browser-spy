import { v4 } from 'uuid';
import { Scene, DefaultEventParams, RefinedEventPathname, TrackingToken } from '../types';

function createTrackingToken() {
  const storageKey = 'trackingToken';
  const days30 = 60 * 60 * 24 * 30 * 1000;
  const newTrackingToken = JSON.stringify({
    sessionID: v4(),
    date: Date.now(),
  });

  const trackingToken = localStorage.getItem(storageKey) || '';

  try {
    const { date } = JSON.parse(trackingToken) as TrackingToken;
    // Expired checking (after 30 days)
    if (Date.now() - date < days30) return trackingToken;

    localStorage.setItem(storageKey, newTrackingToken);
  } catch (error) {
    localStorage.setItem(storageKey, newTrackingToken);
  }
  return newTrackingToken;
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
