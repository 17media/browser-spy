'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var qs = _interopDefault(require('query-string'));
var crypto = _interopDefault(require('crypto'));
var react = require('react');
require('intersection-observer');

function loadScript(src) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.defer = true;
  script.src = src;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
}
function loadScripts(...src) {
  return Promise.all(src.map(loadScript));
}

function trim(object) {
  for (const key in object) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }

    if (object[key] === null) {
      delete object[key];
    }
  }
}
function convertStringToSankecase(str) {
  const upperCaseMap = new Map();
  const strArray = Array.from(str);
  strArray.forEach((char, index) => {
    const currentCharCode = char.charCodeAt(0);
    const asciiCodeA = 'A'.charCodeAt(0);
    const asciiCodeZ = 'Z'.charCodeAt(0);

    if (currentCharCode >= asciiCodeA && currentCharCode <= asciiCodeZ) {
      upperCaseMap.set(index, char);
    }
  });
  upperCaseMap.forEach((value, key) => {
    strArray[key] = `_${value.toLowerCase()}`;
  });
  return strArray.join('');
}
function convertParamsToSankecase(params) {
  return Object.keys(params).reduce((prev, key) => {
    const currentParams = prev;
    const snakecaseKey = convertStringToSankecase(key);
    currentParams[snakecaseKey] = params[key];
    return currentParams;
  }, {});
}

/* eslint-disable @typescript-eslint/camelcase */
var AgentState;

(function (AgentState) {
  AgentState[AgentState["Uninitialized"] = 0] = "Uninitialized";
  AgentState[AgentState["Initializing"] = 1] = "Initializing";
  AgentState[AgentState["Initialized"] = 2] = "Initialized";
  AgentState[AgentState["InitializeFail"] = 3] = "InitializeFail";
})(AgentState || (AgentState = {}));

class Agent {
  constructor() {
    this.state = AgentState.Uninitialized;
  }

  async initialize() {
    if (this.state !== AgentState.Uninitialized) return;
    this.state = AgentState.Initializing;

    try {
      await this.doInitialize();
      this.state = AgentState.Initialized;
    } catch (error) {
      console.error(error);
      this.state = AgentState.InitializeFail;
    }
  }

}
let isInit = false;
class FirebaseAgent extends Agent {
  /**
   * @param config @see https://support.google.com/firebase/answer/7015592
   */
  constructor(config) {
    super();
    this.config = config;
    this.queue = [];
  }

  async doInitialize() {
    await loadScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js');

    if (!isInit) {
      this.client = firebase.initializeApp(this.config).analytics();
      isInit = true;
    } else {
      this.client = firebase.analytics();
    }

    this.queue.forEach(callback => callback());
    this.queue = [];
  }

  report(event) {
    this.queueIfNotInitialized(() => this.doReport(event));
  }

  doReport(event) {
    switch (event.type) {
      case 'login':
        return this.login(event);

      case 'tracking':
        return this.track(event);

      case 'transition':
        return this.transit(event);
    }
  }

  login(event) {
    const {
      userId
    } = event;
    this.client.setUserId(userId, {
      global: true
    });
    if (userId) this.client.logEvent('login', {
      userId
    });
  }

  transit(event) {
    const {
      toScene,
      defaultTrackingParams
    } = event;
    const {
      title,
      hostname,
      pathname
    } = toScene;
    this.client.logEvent('page_view', {
      page_title: title,
      page_location: hostname,
      page_path: pathname,
      ...convertParamsToSankecase(defaultTrackingParams)
    });
    this.client.setCurrentScreen(event.toScene.title, {
      global: true
    });
  }

  track(event) {
    const {
      eventName,
      trackingParams = {}
    } = event;
    trim(trackingParams);
    this.client.logEvent(eventName, convertParamsToSankecase(trackingParams));
  }

  queueIfNotInitialized(callback) {
    if (this.state === AgentState.Initialized) callback();else this.queue.push(callback);
  }

}
class MatomoAgent extends Agent {
  constructor(config) {
    super();
    this.config = config;
    this.client = window._paq; // eslint-disable-line no-underscore-dangle

    this.trackPageViewTimer = 0;
    this.intialized = false;
  }

  async doInitialize() {
    const url = `//${this.config.endpoint}/`;
    this.client.push(['setTrackerUrl', `${url}matomo.php`]);
    this.client.push(['setSiteId', this.config.siteId]);
    this.client.push(['trackPageView']);
    this.client.push(['enableLinkTracking']);
    this.client.push(['trackAllContentImpressions']);
    await loadScript(`${url}piwik.js`);
  }

  report(event) {
    switch (event.type) {
      case 'login':
        return this.login(event);

      case 'tracking':
        return this.track(event);

      case 'transition':
        return this.transit(event);
    }
  }

  login(event) {
    const {
      userId
    } = event;
    if (userId) this.client.push(['setUserId', userId]);else this.client.push(['resetUserId']);
    this.requestTrackPageView();
  }

  transit(event) {
    const {
      fromScene,
      toScene
    } = event;
    this.client.push(['setReferrerUrl', `${fromScene.hostname}${fromScene.pathname}`]);
    this.client.push(['setCustomUrl', `${toScene.hostname}${fromScene.pathname}`]);
    this.client.push(['setDocumentTitle', toScene.title]);
    this.client.push(['setGenerationTimeMs', 0]);
    this.requestTrackPageView();
    this.client.push(['enableLinkTracking']);
    this.client.push(['trackAllContentImpressions']);
  }

  track(event) {
    /**
     * ref : https://developer.matomo.org/guides/tracking-javascript
     * trackEvent(category, action, [name], [value]) -
     * Log an event with an event category (Videos, Music, Games...), an event action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...), and an optional event name and optional numeric value.
     */
    const {
      eventName,
      category,
      trackingParams = {}
    } = event;
    const {
      name = '',
      value = ''
    } = trackingParams;
    this.client.push(['trackEvent', category, eventName, name, value]);
  }

  requestTrackPageView() {
    if (this.trackPageViewTimer) clearTimeout(this.trackPageViewTimer);
    this.trackPageViewTimer = setTimeout(() => {
      this.client.push(['trackPageView']);
      this.trackPageViewTimer = 0;
    });
  }

}

const tagNameRole = {
  alert: 'alert',
  alertdialog: 'alertdialog',
  application: 'application',
  article: 'article',
  banner: 'banner',
  button: 'button',
  cell: 'cell',
  checkbox: 'checkbox',
  columnheader: 'columnheader',
  combobox: 'combobox',
  command: 'command',
  complementary: 'complementary',
  composite: 'composite',
  contentinfo: 'contentinfo',
  definition: 'definition',
  dialog: 'dialog',
  directory: 'directory',
  document: 'document',
  feed: 'feed',
  figure: 'figure',
  form: 'form',
  grid: 'grid',
  gridcell: 'gridcell',
  group: 'group',
  heading: 'heading',
  img: 'img',
  input: 'input',
  landmark: 'landmark',
  link: 'link',
  list: 'list',
  listbox: 'listbox',
  listitem: 'listitem',
  log: 'log',
  main: 'main',
  'The main content of a document.': 'The main content of a document.',
  marquee: 'marquee',
  math: 'math',
  'Content that represents a mathematical expression.': 'Content that represents a mathematical expression.',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  menuitemcheckbox: 'menuitemcheckbox',
  menuitemradio: 'menuitemradio',
  navigation: 'navigation',
  none: 'none',
  note: 'note',
  option: 'option',
  presentation: 'presentation',
  progressbar: 'progressbar',
  radio: 'radio',
  radiogroup: 'radiogroup',
  range: 'range',
  region: 'region',
  roletype: 'roletype',
  row: 'row',
  rowgroup: 'rowgroup',
  rowheader: 'rowheader',
  scrollbar: 'scrollbar',
  search: 'search',
  searchbox: 'searchbox',
  section: 'section',
  sectionhead: 'sectionhead',
  select: 'select',
  separator: 'separator',
  slider: 'slider',
  spinbutton: 'spinbutton',
  status: 'status',
  structure: 'structure',
  switch: 'switch',
  tab: 'tab',
  table: 'table',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  term: 'term',
  textbox: 'textbox',
  timer: 'timer',
  toolbar: 'toolbar',
  tooltip: 'tooltip',
  tree: 'tree',
  treegrid: 'treegrid',
  treeitem: 'treeitem',
  widget: 'widget',
  window: 'window'
};
function guessRole(element) {
  return element.getAttribute('role') || tagNameRole[element.tagName] || 'unknown';
}
function getContent(element) {
  return element.innerText;
}

var rnds8 = new Uint8Array(16);
function rng() {
  return crypto.randomFillSync(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function bytesToUuid(buf, offset_) {
  var offset = offset_ || 0; // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434

  return (byteToHex[buf[offset + 0]] + byteToHex[buf[offset + 1]] + byteToHex[buf[offset + 2]] + byteToHex[buf[offset + 3]] + '-' + byteToHex[buf[offset + 4]] + byteToHex[buf[offset + 5]] + '-' + byteToHex[buf[offset + 6]] + byteToHex[buf[offset + 7]] + '-' + byteToHex[buf[offset + 8]] + byteToHex[buf[offset + 9]] + '-' + byteToHex[buf[offset + 10]] + byteToHex[buf[offset + 11]] + byteToHex[buf[offset + 12]] + byteToHex[buf[offset + 13]] + byteToHex[buf[offset + 14]] + byteToHex[buf[offset + 15]]).toLowerCase();
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return bytesToUuid(rnds);
}

function getUserID() {
  const qsUserID = qs.parse(window.location.search).userID;

  if (Array.isArray(qsUserID)) {
    return sessionStorage.getItem('userID') || 'guest';
  } // The order of checking UserID.
  // 1. sessionStorage
  // 2. query string


  return sessionStorage.getItem('userID') || qsUserID || 'guest';
}

function createTrackingToken() {
  const storageKey = 'trackingToken';
  const days30 = 60 * 60 * 24 * 30 * 1000;
  const newTrackingToken = {
    sessionID: v4(),
    date: Date.now()
  };

  try {
    const trackingToken = JSON.parse(localStorage.getItem(storageKey) || '');
    const {
      date,
      sessionID
    } = trackingToken; // Expired checking (after 30 days)

    if (Date.now() - date < days30) return sessionID;
    localStorage.setItem(storageKey, JSON.stringify(newTrackingToken));
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(newTrackingToken));
  }

  return newTrackingToken.sessionID;
}

function createScene() {
  const {
    title
  } = window.document;
  const {
    hostname,
    pathname
  } = window.location;
  return {
    title,
    hostname,
    pathname
  };
}
function refineEventPathname(pathname) {
  var _pathname$match;

  const slashCount = (_pathname$match = pathname.match(/-/g)) === null || _pathname$match === void 0 ? void 0 : _pathname$match.length;
  if (!slashCount) return {
    eventId: '',
    codename: ''
  };
  if (slashCount === 1 || slashCount === 2) return {
    eventId: '',
    codename: pathname
  }; // slashCount === 3+

  const pathnameArray = pathname.split('-');
  const eventId = pathnameArray[0];
  const codename = pathnameArray.splice(1, pathnameArray.length).join('-');
  return {
    eventId,
    codename
  };
}
function createDefaultEventParams() {
  const codenameArray = window.location.pathname.split('/');
  const eventPathname = codenameArray.length > 1 ? codenameArray[1] : '';
  const {
    eventId,
    codename
  } = refineEventPathname(eventPathname);
  const trackingToken = createTrackingToken();
  return {
    userId: getUserID(),
    lang: navigator.language || '',
    os: navigator.userAgent || '',
    timestamp: Date.now(),
    codename,
    eventId,
    guestSessionId: trackingToken
  };
}

class DefaultSource {
  constructor() {
    this.agents = [];
    this.currentScene = createScene();
  }

  addAgent(agent) {
    agent.initialize();
    this.agents.push(agent);
  }

  spyTransition(history) {
    // wait for whole page updated
    // init page_view
    setTimeout(() => this.transit(createScene()), 100);
    history.listen(() => {
      const {
        action
      } = history; // Filtering replace action (The pushed url is not matching, ex: Redirect)

      if (action === 'PUSH') {
        setTimeout(() => this.transit(createScene()), 100);
      }
    });
  }

  spyClick() {
    window.addEventListener('click', event => {
      const {
        target
      } = event;

      if (target instanceof HTMLElement) {
        this.track({
          eventName: 'click',
          category: 'default',
          trackingParams: {
            name: getContent(target),
            value: '',
            role: guessRole(target)
          }
        });
      }
    });
  } // tracking page visibility. e.g. page minimized, change browser tab or page unload


  spyPageDurationByVisible(params) {
    let startDurationTime = 0;

    const handleVisibleChange = e => {
      if (document.visibilityState === 'hidden') {
        const endDurationTime = e.timeStamp;
        const duration = Math.floor(endDurationTime - startDurationTime);
        this.track({
          eventName: 'pageView',
          category: 'default',
          trackingParams: {
            url: window.location.href,
            duration,
            ...params
          }
        });
      }

      if (document.visibilityState === 'visible') {
        startDurationTime = e.timeStamp;
      }
    };

    document.addEventListener('visibilitychange', handleVisibleChange);
  }

  spyPageDurationByTransition(history, params) {
    let startDurationTime = Date.now();
    let url = window.location.href;
    history.listen(() => {
      const endDurationTime = Date.now();
      const duration = Math.floor(endDurationTime - startDurationTime);
      this.track({
        eventName: 'pageView',
        category: 'default',
        trackingParams: {
          url,
          duration,
          ...params
        }
      });
      startDurationTime = endDurationTime;
      url = window.location.href;
    });
  }

  login(userId) {
    this.agents.forEach(agent => agent.report({
      type: 'login',
      userId
    }));
  }

  transit(toScene) {
    const fromScene = this.currentScene;
    const event = {
      type: 'transition',
      fromScene,
      toScene,
      defaultTrackingParams: createDefaultEventParams()
    };
    this.agents.forEach(agent => agent.report(event));
  }

  track(event) {
    const {
      trackingParams
    } = event;
    const defaultParams = (trackingParams === null || trackingParams === void 0 ? void 0 : trackingParams.hasOwnProperty('productName')) ? {} : createDefaultEventParams();
    const mergedTrackingParams = { ...defaultParams,
      ...trackingParams
    };
    event.trackingParams = mergedTrackingParams;
    this.agents.forEach(agent => agent.report({
      type: 'tracking',
      ...event
    }));
  }

}

(function (Threshold) {
  Threshold[Threshold["MIN"] = 0] = "MIN";
  Threshold[Threshold["HALF"] = 0.5] = "HALF";
  Threshold[Threshold["FULL"] = 1] = "FULL";
})(exports.Threshold || (exports.Threshold = {}));

const EVENT_NAME_CLICK = 'click';
const EVENT_NAME_ENTER = 'enter';
const EVENT_NAME_LEAVE = 'leave';
const EVENT_NAME_SEARCH = 'search';
const EVENT_NAME_SECTION_VIEW = 'section_view';
const CATEGORY_DEFAULT = 'default';
const ACTION_BUTTON_CLICK = 'ButtonClick';
const ACTION_TAB_CLICK = 'TabClick';
const ACTION_PROFILE_CLICK = 'ProfileClick';
const ACTION_LINK_CLICK = 'LinkClick';
const ACTION_ENTER = 'enter';
const __CLIENT__ = typeof window !== 'undefined' && typeof window.document !== 'undefined';

class SectionObserver {
  constructor(debounce, threshold) {
    this.debounceExecute = 0;

    this.sectionObserve = (ref, callback) => {
      var _this$observer;

      (_this$observer = this.observer) === null || _this$observer === void 0 ? void 0 : _this$observer.observe(ref.current);
      this.elementMap.set(ref.current, callback);
    };

    this.sectionUnobserve = ref => {
      var _this$observer2;

      (_this$observer2 = this.observer) === null || _this$observer2 === void 0 ? void 0 : _this$observer2.unobserve(ref.current);
      if (this.elementMap.has(ref.current)) this.elementMap.delete(ref.current);
    };

    this.resetSectionObserver = () => {
      this.elementMap.forEach((value, key) => {
        var _this$observer3;

        (_this$observer3 = this.observer) === null || _this$observer3 === void 0 ? void 0 : _this$observer3.observe(key);
      });
    };

    this.sectionIntersect = entries => {
      entries.forEach(entry => {
        const {
          target
        } = entry;

        if (entry.isIntersecting && this.elementMap.has(target)) {
          var _this$observer4;

          const callback = this.elementMap.get(target);
          if (!callback) return;
          callback();
          (_this$observer4 = this.observer) === null || _this$observer4 === void 0 ? void 0 : _this$observer4.unobserve(target);
        }
      });
    };

    this.debounceSectionIntersect = entries => {
      entries.forEach(entry => {
        const {
          target
        } = entry;

        if (entry.isIntersecting && this.elementMap.has(target)) {
          var _this$observer5;

          const callback = this.elementMap.get(target);
          if (!callback) return;
          clearTimeout(this.debounceExecute);
          this.debounceExecute = window.setTimeout(() => {
            callback();
          }, 1000);
          (_this$observer5 = this.observer) === null || _this$observer5 === void 0 ? void 0 : _this$observer5.unobserve(target);
        }
      });
    };

    this.elementMap = new Map();

    try {
      this.observer = new window.IntersectionObserver(entries => {
        if (debounce) {
          this.debounceSectionIntersect(entries);
        } else {
          this.sectionIntersect(entries);
        }
      }, {
        threshold: [threshold]
      });
    } catch (error) {
      console.log(`Error occur when creating IntersectionObserver: ${error}`);
    }
  }

}

let completeSectionObserver;
let halfSectionObserver;
let minSectionObserver;
let rankSectionObserver;
function registCompleteSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registCompleteSectionObserver()] should be invoked on client side.');
  }

  if (!completeSectionObserver) completeSectionObserver = new SectionObserver(false, exports.Threshold.FULL);
  completeSectionObserver.sectionObserve(ref, callback);
  return () => {
    completeSectionObserver.sectionUnobserve(ref);
  };
}
function registHalfSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registHalfSectionObserver()] should be invoked on client side.');
  }

  if (!halfSectionObserver) halfSectionObserver = new SectionObserver(false, exports.Threshold.HALF);
  halfSectionObserver.sectionObserve(ref, callback);
  return () => {
    halfSectionObserver.sectionUnobserve(ref);
  };
}
function registMinSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registMinSectionObserver()] should be invoked on client side.');
  }

  if (!minSectionObserver) minSectionObserver = new SectionObserver(false, exports.Threshold.MIN);
  minSectionObserver.sectionObserve(ref, callback);
  return () => {
    minSectionObserver.sectionUnobserve(ref);
  };
}
function registRankSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registRankSectionObserver()] should be invoked on client side.');
  }

  if (!rankSectionObserver) rankSectionObserver = new SectionObserver(true, exports.Threshold.FULL);
  rankSectionObserver.sectionObserve(ref, callback);
  return () => {
    rankSectionObserver.sectionUnobserve(ref);
  };
}
function resetSectionObserverStatus() {
  if (completeSectionObserver) completeSectionObserver.resetSectionObserver();
  if (halfSectionObserver) halfSectionObserver.resetSectionObserver();
  if (minSectionObserver) minSectionObserver.resetSectionObserver();
  if (rankSectionObserver) rankSectionObserver.resetSectionObserver();
}

function useCompleteSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registCompleteSectionObserver(ref, callback);
  });
}
function useHalfSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registHalfSectionObserver(ref, callback);
  });
}
function useMinSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registMinSectionObserver(ref, callback);
  });
}
function useRankSectionTracking(ref, callback) {
  react.useEffect(() => {
    if (ref.current === null) return;
    return registRankSectionObserver(ref, callback);
  });
}
function usePageTransitionListener(trackingSource, history) {
  react.useEffect(() => {
    // Regist history (for page_view & screen_view)
    trackingSource.spyTransition(history);
    history.listen(() => {
      resetSectionObserverStatus();
    });
  }, [history]);
}

function createButtonClickAction(buttonName, link) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_BUTTON_CLICK,
      name: buttonName,
      page: link
    }
  };
}
function createPageEnterAction(utmCampaign, utmContent, utmMedium, utmSource) {
  return {
    eventName: EVENT_NAME_ENTER,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      utmCampaign,
      utmContent,
      utmMedium,
      utmSource
    }
  };
}
function createPageLeaveAction() {
  return {
    eventName: EVENT_NAME_LEAVE,
    category: CATEGORY_DEFAULT
  };
}
function createTabClickAction(link, tabName) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_TAB_CLICK,
      page: link,
      name: tabName
    }
  };
}
function createProfileClickAction(userID, liveStatus, profileType) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_PROFILE_CLICK,
      type: profileType,
      streamerId: userID,
      liveStatus: liveStatus,
      leaderboardId: '',
      hasDeeplink: false
    }
  };
}
function createSearchAction(keyword, count) {
  return {
    eventName: EVENT_NAME_SEARCH,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      searchString: keyword,
      resultCount: count
    }
  };
}
function createVoteAction(voteTopic) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_BUTTON_CLICK,
      name: voteTopic,
      type: 'vote'
    }
  };
}
function createLeaderboardSectionViewAction(rank) {
  return {
    eventName: EVENT_NAME_SECTION_VIEW,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_ENTER,
      section: 'leaderboardItem',
      rank
    }
  };
}
function createLinkClickAction(link, linkName) {
  return {
    eventName: EVENT_NAME_CLICK,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_LINK_CLICK,
      url: link,
      name: linkName
    }
  };
}
function createSectionViewAction(section, customPath) {
  return {
    eventName: EVENT_NAME_SECTION_VIEW,
    category: CATEGORY_DEFAULT,
    trackingParams: {
      action: ACTION_ENTER,
      section,
      // For customized event to use.
      customPath
    }
  };
}

exports.Agent = Agent;
exports.DefaultSource = DefaultSource;
exports.FirebaseAgent = FirebaseAgent;
exports.MatomoAgent = MatomoAgent;
exports.createButtonClickAction = createButtonClickAction;
exports.createLeaderboardSectionViewAction = createLeaderboardSectionViewAction;
exports.createLinkClickAction = createLinkClickAction;
exports.createPageEnterAction = createPageEnterAction;
exports.createPageLeaveAction = createPageLeaveAction;
exports.createProfileClickAction = createProfileClickAction;
exports.createSearchAction = createSearchAction;
exports.createSectionViewAction = createSectionViewAction;
exports.createTabClickAction = createTabClickAction;
exports.createVoteAction = createVoteAction;
exports.useCompleteSectionTracking = useCompleteSectionTracking;
exports.useHalfSectionTracking = useHalfSectionTracking;
exports.useMinSectionTracking = useMinSectionTracking;
exports.usePageTransitionListener = usePageTransitionListener;
exports.useRankSectionTracking = useRankSectionTracking;
//# sourceMappingURL=index.js.map
