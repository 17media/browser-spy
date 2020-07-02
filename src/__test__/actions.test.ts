import {
  createButtonClickAction,
  createPageEnterAction,
  createPageLeaveAction,
  createTabClickAction,
  createProfileClickAction,
  createSearchAction,
  createVoteAction,
  createLeaderboardSectionViewAction,
  createLinkClickAction,
  createSectionViewAction,
} from '../actions';

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
} from '../utils/constants';

import { TrackingEvent } from '../types';
type EventAction = Omit<TrackingEvent, 'type'>;

describe('Tracking actions testing', () => {
  test('[createButtonClickAction] Should return the correct action.', () => {
    const buttonName = 'buttonName';
    const link = 'link';

    const expectResult: EventAction = {
      eventName: EVENT_NAME_CLICK,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        action: ACTION_BUTTON_CLICK,
        name: buttonName,
        page: link,
      },
    };

    expect(createButtonClickAction(buttonName, link)).toEqual(expectResult);
  });

  test('[createPageEnterAction] Should return the correct action.', () => {
    const utmCampaign = 'utmCampaign';
    const utmContent = 'utmContent';
    const utmMedium = 'utmMedium';
    const utmSource = 'utmSource';

    const expectResult: EventAction = {
      eventName: EVENT_NAME_ENTER,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        utmCampaign,
        utmContent,
        utmMedium,
        utmSource,
      },
    };

    expect(createPageEnterAction(utmCampaign, utmContent, utmMedium, utmSource)).toEqual(expectResult);
  });

  test('[createPageLeaveAction] Should return the correct action.', () => {
    const expectResult: EventAction = {
      eventName: EVENT_NAME_LEAVE,
      category: CATEGORY_DEFAULT,
    };

    expect(createPageLeaveAction()).toEqual(expectResult);
  });

  test('[createTabClickAction] Should return the correct action.', () => {
    const link = 'link';
    const tabName = 'tabName';
    const expectResult: EventAction = {
      eventName: EVENT_NAME_CLICK,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        action: ACTION_TAB_CLICK,
        page: link,
        name: tabName,
      },
    };

    expect(createTabClickAction(link, tabName)).toEqual(expectResult);
  });

  test('[createProfileClickAction] Should return the correct action.', () => {
    const profileType = 'profileType';
    const userID = 'userID';
    const liveStatus = true;

    const expectResult: EventAction = {
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

    expect(createProfileClickAction(userID, liveStatus, profileType)).toEqual(expectResult);
  });

  test('[createSearchAction] Should return the correct action.', () => {
    const keyword = 'keyword';
    const count = 0;
    const expectResult: EventAction = {
      eventName: EVENT_NAME_SEARCH,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        searchString: keyword,
        resultCount: count,
      },
    };

    expect(createSearchAction(keyword, count)).toEqual(expectResult);
  });

  test('[createVoteAction] Should return the correct action.', () => {
    const voteTopic = 'voteTopic';
    const expectResult: EventAction = {
      eventName: EVENT_NAME_CLICK,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        action: ACTION_BUTTON_CLICK,
        name: voteTopic,
        type: 'vote',
      },
    };

    expect(createVoteAction(voteTopic)).toEqual(expectResult);
  });

  test('[createLeaderboardSectionViewAction] Should return the correct action.', () => {
    const rank = 0;
    const expectResult: EventAction = {
      eventName: EVENT_NAME_SECTION_VIEW,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        action: ACTION_ENTER,
        section: 'leaderboardItem',
        rank,
      },
    };

    expect(createLeaderboardSectionViewAction(rank)).toEqual(expectResult);
  });

  test('[createLinkClickAction] Should return the correct action.', () => {
    const link = 'link';
    const linkName = 'linkName';
    const expectResult: EventAction = {
      eventName: EVENT_NAME_CLICK,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        action: ACTION_LINK_CLICK,
        url: link,
        name: linkName,
      },
    };

    expect(createLinkClickAction(link, linkName)).toEqual(expectResult);
  });

  test('[createSectionViewAction] Should return the correct action.', () => {
    const section = 'buttons';
    const customPath = undefined;
    const expectResult: EventAction = {
      eventName: EVENT_NAME_SECTION_VIEW,
      category: CATEGORY_DEFAULT,
      trackingParams: {
        action: ACTION_ENTER,
        section,
        customPath,
      },
    };

    expect(createSectionViewAction(section, customPath)).toEqual(expectResult);
  });
});
