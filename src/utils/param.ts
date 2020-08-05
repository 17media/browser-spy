import qs from 'query-string';
import { v4 } from 'uuid';
import { Scene, DefaultEventParams, RefinedEventPathname, TrackingToken } from 'types';

function getUserID() {
  const qsUserID = qs.parse(window.location.search).userID;
  if (Array.isArray(qsUserID)) {
    return sessionStorage.getItem('userID') || 'guest';
  }
  // The order of checking UserID.
  // 1. sessionStorage
  // 2. query string
  return sessionStorage.getItem('userID') || qsUserID || 'guest';
}

function createTrackingToken() {
  const storageKey = 'trackingToken';
  const days30 = 60 * 60 * 24 * 30 * 1000;
  const newTrackingToken: TrackingToken = {
    sessionID: v4(),
    date: Date.now(),
  };

  try {
    const trackingToken = JSON.parse(localStorage.getItem(storageKey) || '') as TrackingToken;
    const { date, sessionID } = trackingToken;
    // Expired checking (after 30 days)
    if (Date.now() - date < days30) return sessionID;

    localStorage.setItem(storageKey, JSON.stringify(newTrackingToken));
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(newTrackingToken));
  }
  return newTrackingToken.sessionID;
}

export function createScene(): Scene {
  const { title } = window.document;
  const { hostname, pathname } = window.location;
  return { title, hostname, pathname };
}

export function refineEventPathname(pathname: string): RefinedEventPathname {
  const slashCount = pathname.match(/-/g)?.length;
  if (slashCount && slashCount >= 3) {
    // slashCount === 3+
    const pathnameArray = pathname.split('-');
    const eventId = pathnameArray[0];
    const codename = pathnameArray.splice(1, pathnameArray.length).join('-');
    return { eventId, codename };
  }
  return { eventId: '', codename: pathname };
}

export function createDefaultEventParams(): DefaultEventParams {
  const codenameArray = window.location.pathname.split('/');
  const eventPathname = codenameArray.length > 1 ? codenameArray[1] : '';
  const { eventId, codename } = refineEventPathname(eventPathname);
  const trackingToken = createTrackingToken();

  return {
    userId: getUserID(),
    lang: navigator.language || '',
    os: navigator.userAgent || '',
    timestamp: Date.now(),
    codename,
    eventId,
    guestSessionId: trackingToken,
  };
}
