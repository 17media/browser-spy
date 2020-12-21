interface BaseEvent<Payload> {
  type: 'tracking';
  category: string;
  action: string;
  name: string;
  payload: Payload;
  $$type: 'TrackingEvent';
}

// auto injection
export interface BasePayload {
  //如果是訪客打 "guest"
  userId?: string;
  lang?: string;
  os?: string;
  eventId?: string;
  timestamp?: string;
  codename?: string;
  guestSessionId?: string;
  sourceUrl?: string;
  componentId?: string;
  componentType?: string;
  traceId?: string;
  genericJson?: string;
  genericText?: string;
  contentId?: string;
  contentType?: string;
}

interface ClickButtonEventPayload extends BasePayload {
  action: 'ButtonClick';
  name: string;
}

export interface ClickButtonEvent extends BaseEvent<ClickButtonEventPayload> {
  category: 'PageSurfing';
  action: 'click';
}

interface ClickTabEventPayload extends BasePayload {
  action: 'ButtonClick';
  name: string;
  // url
  page: string;
}

export interface ClickTabEvent extends BaseEvent<ClickTabEventPayload> {
  category: 'PageSurfing';
  action: 'click';
}

interface ClickLeaderboardButtonEventPayload extends BasePayload {
  action: 'ButtonClick';
  name: string;
  // bonus, contributor, vote
  type: string;
}

export interface ClickLeaderboardButtonEvent extends BaseEvent<ClickLeaderboardButtonEventPayload> {
  category: 'PageSurfing';
  action: 'click';
  name: 'button_expend.open' | 'button_expend.close' | 'button_vote';
}

interface ClickTopStreamerEventPayload extends BasePayload {
  action: 'ProfileClick';
  leaderboardId: string;
  streamerId: string;
  type: 'topavatar';
  liveStatus: boolean;
  // 如果有勾選“Open 17 app when clicking avatar if enable.”則為true,反之則為false
  hasDeeplink: boolean;
}

export interface ClickTopStreamerEvent extends BaseEvent<ClickTopStreamerEventPayload> {
  // 直撥中 = LiveStream, 非直撥中 = Profile
  category: 'LiveStream' | 'Profile';
  action: 'click';
  name: 'avatar_top';
}

interface ClickStreamerEventPayload extends BasePayload {
  action: 'ProfileClick';
  leaderboardId: string;
  streamerId: string;
  type: 'avatar';
  liveStatus: boolean;
  // 如果有勾選“Open 17 app when clicking avatar if enable.”則為true,反之則為false
  hasDeeplink: boolean;
}

export interface ClickStreamerEvent extends BaseEvent<ClickStreamerEventPayload> {
  // 直撥中 = LiveStream, 非直撥中 = Profile
  category: 'LiveStream' | 'Profile';
  action: 'click';
  name: 'avatar_streamer';
}

interface LinkEventPayload extends BasePayload {
  action: 'LinkClick';
  url: string;
  //超連結字名稱
  name: string;
}

export interface LinkEvent extends BaseEvent<LinkEventPayload> {
  category: 'PageSurfing';
  action: 'click';
  name: 'link_info';
}

interface PageViewEventPayload extends BasePayload {
  leaderboardStartTime: number;
  leaderboardEndTime: number;
  // url
  from: string;
  // url
  to: string;
  utmCampaign: string;
  utmContent: string;
  utmMedium: string;
  utmSource: string;
}

export interface PageViewEvent extends BaseEvent<PageViewEventPayload> {
  category: 'Leaderboard' | 'Infomation';
  action: 'view';
  name: 'event_view';
}

interface SectionViewEventPayload extends BasePayload {
  section: string;
  action: 'enter' | 'leave';
  //滑榜單停下時,打看到的最後一個名次
  rank?: number;
  // 提供給客製活動使用(因為url不會轉換)
  customPath?: string;
}

export interface SectionViewEvent extends BaseEvent<SectionViewEventPayload> {
  category: 'PageSurfing';
  action: 'scroll';
}

interface SearchUserEventPayload extends BasePayload {
  searchString: string;
  resultCount: number;
}

export interface SearchUserEvent extends BaseEvent<SearchUserEventPayload> {
  category: 'Content';
  action: 'search';
  name: 'search_user';
}

export type TrackingEvent =
  | ClickButtonEvent
  | ClickTabEvent
  | ClickLeaderboardButtonEvent
  | ClickTopStreamerEvent
  | ClickStreamerEvent
  | LinkEvent
  | PageViewEvent
  | SectionViewEvent
  | SearchUserEvent;

export function isTrackingEvent(value: unknown): value is TrackingEvent {
  if (typeof value !== 'object') return false;
  if (value === null) return false;
  return (value as TrackingEvent).$$type === 'TrackingEvent';
}
