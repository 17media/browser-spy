import {
  EVENT_NAME_CLICK,
  EVENT_NAME_ENTER,
  EVENT_NAME_LEAVE,
  EVENT_NAME_SEARCH,
  EVENT_NAME_SECTION_VIEW,
  CATEGORY_DEFAULT,
  ACTION_BUTTON_CLICK,
  ACTION_TAB_CLICK,
  ACTION_PROFILE_CLICK,
  ACTION_LINK_CLICK,
  ACTION_ENTER,
} from './utils/constants';

import { TrackingEvent } from './types';

type EventAction = Omit<TrackingEvent, 'type'>;
type SectionName = 'buttons' | 'duration' | 'gifts' | 'searchBar' | 'tabs' | 'description' | 'timeline' | 'topStreamer';
type ProfileName = 'topavatar' | 'avatar';

export function createButtonClickAction(buttonName: string, link: string): EventAction {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_BUTTON_CLICK,
      name: buttonName,
      page: link,
    },
  };
}

export function createPageEnterAction(
  utmCampaign: string,
  utmContent: string,
  utmMedium: string,
  utmSource: string,
): EventAction {
  return {
    eventName: EVENT_NAME_ENTER,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      utmCampaign,
      utmContent,
      utmMedium,
      utmSource,
    },
  };
}

export function createPageLeaveAction(): EventAction {
  return {
    eventName: EVENT_NAME_LEAVE,
    category: CATEGORY_DEFAULT,
  };
}

export function createTabClickAction(link: string, tabName: string): EventAction {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_TAB_CLICK,
      page: link,
      name: tabName,
    },
  };
}

export function createProfileClickAction(userID: string, liveStatus: boolean, profileType: ProfileName): EventAction {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_PROFILE_CLICK,
      type: profileType,
      streamerId: userID,
      liveStatus: liveStatus,
      leaderboardId: '',
      hasDeeplink: false,
    },
  };
}

export function createSearchAction(keyword: string, count: number): EventAction {
  return {
    eventName: EVENT_NAME_SEARCH,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      searchString: keyword,
      resultCount: count,
    },
  };
}

export function createVoteAction(voteTopic: string): EventAction {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_BUTTON_CLICK,
      name: voteTopic,
      type: 'vote',
    },
  };
}

export function createLeaderboardSectionViewAction(rank: number): EventAction {
  return {
    eventName: EVENT_NAME_SECTION_VIEW,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_ENTER,
      section: 'leaderboardItem',
      rank,
    },
  };
}

export function createLinkClickAction(link: string, linkName: string): EventAction {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_LINK_CLICK,
      url: link,
      name: linkName,
    },
  };
}

export function createSectionViewAction(section: SectionName, customPath?: string): EventAction {
  return {
    eventName: EVENT_NAME_SECTION_VIEW,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_ENTER,
      section,
      // For customized event to use.
      customPath,
    },
  };
}
