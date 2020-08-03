export enum Threshold {
  'MIN' = 0,
  'HALF' = 0.5,
  'FULL' = 1,
}

export interface Scene {
  title: string;
  hostname: string;
  pathname: string;
}

export interface TransitionEvent {
  type: 'transition';
  fromScene: Scene;
  toScene: Scene;
  defaultTrackingParams: DefaultEventParams;
}

export interface TrackingToken {
  sessionID: string;
  date: number;
}

export interface TrackingEventParams {
  userId?: string;
  lang?: string;
  os?: string;
  eventId?: string;
  timestamp?: number;
  action?: string;
  name?: string;
  role?: string;
  value?: string;
  page?: string;
  type?: string;
  leaderboardId?: string;
  streamerId?: string;
  liveStatus?: boolean;
  section?: string;
  rank?: number;
  to?: string;
  url?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmSource?: string;
  searchString?: string;
  resultCount?: number;
  hasDeeplink?: boolean;
  codename?: string;
  productName?: string;
  userName?: string;
  from?: string;
  result?: string;
  duration?: number;
  customPath?: string;
}
export interface TrackingEvent {
  type: 'tracking';
  eventName: string;
  category: string;
  trackingParams?: TrackingEventParams;
}

export interface DefaultEventParams {
  userId: string;
  lang: string;
  os: string;
  eventId: string;
  timestamp: number;
  codename: string;
  guestSessionId: string;
}

export interface LoginEvent {
  type: 'login';
  userId: string;
}

export interface RefinedEventPathname {
  eventId: string;
  codename: string;
}

export type ElementMap = Map<Element, Function>;

export type SpyEvent = TrackingEvent | TransitionEvent | LoginEvent;

export type EventCallback<T> = (event: T) => void;

export type EventListener<T> = (callback: EventCallback<T>) => void;
