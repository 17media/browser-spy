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

    expect(createButtonClickAction(buttonName, link)).toMatchInlineSnapshot(`
      Object {
        "category": "PageSurfing",
        "eventName": "click",
        "trackingParams": Object {
          "action": "ButtonClick",
          "name": "buttonName",
          "page": "link",
        },
      }
    `);
  });

  test('[createPageEnterAction] Should return the correct action.', () => {
    const utmCampaign = 'utmCampaign';
    const utmContent = 'utmContent';
    const utmMedium = 'utmMedium';
    const utmSource = 'utmSource';

    expect(createPageEnterAction(utmCampaign, utmContent, utmMedium, utmSource)).toMatchInlineSnapshot(`
      Object {
        "category": "default",
        "eventName": "enter",
        "trackingParams": Object {
          "utmCampaign": "utmCampaign",
          "utmContent": "utmContent",
          "utmMedium": "utmMedium",
          "utmSource": "utmSource",
        },
      }
    `);
  });

  test('[createPageLeaveAction] Should return the correct action.', () => {
    expect(createPageLeaveAction()).toMatchInlineSnapshot(`
      Object {
        "category": "default",
        "eventName": "leave",
      }
    `);
  });

  test('[createTabClickAction] Should return the correct action.', () => {
    const link = 'link';
    const tabName = 'tabName';

    expect(createTabClickAction(link, tabName)).toMatchInlineSnapshot(`
      Object {
        "category": "PageSurfing",
        "eventName": "click",
        "trackingParams": Object {
          "action": "TabClick",
          "name": "tabName",
          "page": "link",
        },
      }
    `);
  });

  test('[createProfileClickAction] Should return the correct action.', () => {
    const profileType = 'topavatar';
    const userID = 'userID';
    const liveStatus = true;

    expect(createProfileClickAction(userID, liveStatus, profileType)).toMatchInlineSnapshot(`
      Object {
        "category": "LiveStream",
        "eventName": "click",
        "trackingParams": Object {
          "action": "ProfileClick",
          "hasDeeplink": false,
          "leaderboardId": "",
          "liveStatus": true,
          "streamerId": "userID",
          "type": "topavatar",
        },
      }
    `);
  });

  test('[createSearchAction] Should return the correct action.', () => {
    const keyword = 'keyword';
    const count = 0;
    expect(createSearchAction(keyword, count)).toMatchInlineSnapshot(`
      Object {
        "category": "Content",
        "eventName": "search",
        "trackingParams": Object {
          "resultCount": 0,
          "searchString": "keyword",
        },
      }
    `);
  });

  test('[createVoteAction] Should return the correct action.', () => {
    const voteTopic = 'voteTopic';

    expect(createVoteAction(voteTopic)).toMatchInlineSnapshot(`
      Object {
        "category": "Interaction_vote",
        "eventName": "click",
        "trackingParams": Object {
          "action": "ButtonClick",
          "name": "voteTopic",
          "type": "vote",
        },
      }
    `);
  });

  test('[createLeaderboardSectionViewAction] Should return the correct action.', () => {
    const rank = 0;

    expect(createLeaderboardSectionViewAction(rank)).toMatchInlineSnapshot(`
      Object {
        "category": "PageSurfing",
        "eventName": "section_view",
        "trackingParams": Object {
          "action": "scroll",
          "rank": 0,
          "section": "leaderboardItem",
        },
      }
    `);
  });

  test('[createLinkClickAction] Should return the correct action.', () => {
    const link = 'link';
    const linkName = 'linkName';

    expect(createLinkClickAction(link, linkName)).toMatchInlineSnapshot(`
      Object {
        "category": "PageSurfing",
        "eventName": "click",
        "trackingParams": Object {
          "action": "LinkClick",
          "name": "linkName",
          "url": "link",
        },
      }
    `);
  });

  test('[createSectionViewAction] Should return the correct action.', () => {
    const section = 'buttons';
    const customPath = undefined;

    expect(createSectionViewAction(section, customPath)).toMatchInlineSnapshot(`
      Object {
        "category": "PageSurfing",
        "eventName": "section_view",
        "trackingParams": Object {
          "action": "scroll",
          "customPath": undefined,
          "section": "buttons",
        },
      }
    `);
  });
});
