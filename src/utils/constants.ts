import isMobile from './isMobile';

export const EVENT_NAME_CLICK = 'click';
export const EVENT_NAME_ENTER = 'enter';
export const EVENT_NAME_LEAVE = 'leave';
export const EVENT_NAME_SEARCH = 'search';
export const EVENT_NAME_SECTION_VIEW = 'section_view';

export const CATEGORY_DEFAULT = 'default';

export const ACTION_BUTTON_CLICK = 'ButtonClick';
export const ACTION_TAB_CLICK = 'TabClick';
export const ACTION_PROFILE_CLICK = 'ProfileClick';
export const ACTION_LINK_CLICK = 'LinkClick';
export const ACTION_ENTER = 'scroll';

export const __CLIENT__ = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const matomoCustomDimensionMap: Record<string, string | undefined> = {
  contentId: 'dimension1',
  contentType: 'dimension2',
  search: 'dimension5',
  comment: 'dimension6',
  genericJson: 'dimension11',
  genericText: 'dimension12',
  traceId: 'dimension13',
  appVersion: 'dimension15',
  deviceId: 'dimension16',
  timestamp: 'dimension17',
  componentId: 'dimension21',
  componentType: 'dimension22',
  advertisingId: 'dimension23',
  sourceUrl: 'dimension24',
  user: 'dimension25',
};

export const IS_MOBILE = isMobile();
