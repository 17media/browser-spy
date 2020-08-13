'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var qs = _interopDefault(require('query-string'));
var crypto = _interopDefault(require('crypto'));
var react = require('react');

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

  if (slashCount && slashCount >= 3) {
    // slashCount === 3+
    const pathnameArray = pathname.split('-');
    const eventId = pathnameArray[0];
    const codename = pathnameArray.splice(1, pathnameArray.length).join('-');
    return {
      eventId,
      codename
    };
  }

  return {
    eventId: '',
    codename: pathname
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

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function () {

  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object') {
    return;
  } // Exit early if all IntersectionObserver and IntersectionObserverEntry
  // features are natively supported.


  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function get() {
          return this.intersectionRatio > 0;
        }
      });
    }

    return;
  }
  /**
   * A local reference to the document.
   */


  var document = window.document;
  /**
   * An IntersectionObserver registry. This registry exists to hold a strong
   * reference to IntersectionObserver instances currently observing a target
   * element. Without this registry, instances without another reference may be
   * garbage collected.
   */

  var registry = [];
  /**
   * The signal updater for cross-origin intersection. When not null, it means
   * that the polyfill is configured to work in a cross-origin mode.
   * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */

  var crossOriginUpdater = null;
  /**
   * The current cross-origin intersection. Only used in the cross-origin mode.
   * @type {DOMRect|ClientRect}
   */

  var crossOriginRect = null;
  /**
   * Creates the global IntersectionObserverEntry constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
   * @param {Object} entry A dictionary of instance properties.
   * @constructor
   */

  function IntersectionObserverEntry(entry) {
    this.time = entry.time;
    this.target = entry.target;
    this.rootBounds = ensureDOMRect(entry.rootBounds);
    this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
    this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
    this.isIntersecting = !!entry.intersectionRect; // Calculates the intersection ratio.

    var targetRect = this.boundingClientRect;
    var targetArea = targetRect.width * targetRect.height;
    var intersectionRect = this.intersectionRect;
    var intersectionArea = intersectionRect.width * intersectionRect.height; // Sets intersection ratio.

    if (targetArea) {
      // Round the intersection ratio to avoid floating point math issues:
      // https://github.com/w3c/IntersectionObserver/issues/324
      this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
    } else {
      // If area is zero and is intersecting, sets to 1, otherwise to 0
      this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
  }
  /**
   * Creates the global IntersectionObserver constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
   * @param {Function} callback The function to be invoked after intersection
   *     changes have queued. The function is not invoked if the queue has
   *     been emptied by calling the `takeRecords` method.
   * @param {Object=} opt_options Optional configuration options.
   * @constructor
   */


  function IntersectionObserver(callback, opt_options) {
    var options = opt_options || {};

    if (typeof callback != 'function') {
      throw new Error('callback must be a function');
    }

    if (options.root && options.root.nodeType != 1) {
      throw new Error('root must be an Element');
    } // Binds and throttles `this._checkForIntersections`.


    this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT); // Private properties.

    this._callback = callback;
    this._observationTargets = [];
    this._queuedEntries = [];
    this._rootMarginValues = this._parseRootMargin(options.rootMargin); // Public properties.

    this.thresholds = this._initThresholds(options.threshold);
    this.root = options.root || null;
    this.rootMargin = this._rootMarginValues.map(function (margin) {
      return margin.value + margin.unit;
    }).join(' ');
    /** @private @const {!Array<!Document>} */

    this._monitoringDocuments = [];
    /** @private @const {!Array<function()>} */

    this._monitoringUnsubscribes = [];
  }
  /**
   * The minimum interval within which the document will be checked for
   * intersection changes.
   */


  IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;
  /**
   * The frequency in which the polyfill polls for intersection changes.
   * this can be updated on a per instance basis and must be set prior to
   * calling `observe` on the first target.
   */

  IntersectionObserver.prototype.POLL_INTERVAL = null;
  /**
   * Use a mutation observer on the root element
   * to detect intersection changes.
   */

  IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;
  /**
   * Sets up the polyfill in the cross-origin mode. The result is the
   * updater function that accepts two arguments: `boundingClientRect` and
   * `intersectionRect` - just as these fields would be available to the
   * parent via `IntersectionObserverEntry`. This function should be called
   * each time the iframe receives intersection information from the parent
   * window, e.g. via messaging.
   * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */

  IntersectionObserver._setupCrossOriginUpdater = function () {
    if (!crossOriginUpdater) {
      /**
       * @param {DOMRect|ClientRect} boundingClientRect
       * @param {DOMRect|ClientRect} intersectionRect
       */
      crossOriginUpdater = function crossOriginUpdater(boundingClientRect, intersectionRect) {
        if (!boundingClientRect || !intersectionRect) {
          crossOriginRect = getEmptyRect();
        } else {
          crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
        }

        registry.forEach(function (observer) {
          observer._checkForIntersections();
        });
      };
    }

    return crossOriginUpdater;
  };
  /**
   * Resets the cross-origin mode.
   */


  IntersectionObserver._resetCrossOriginUpdater = function () {
    crossOriginUpdater = null;
    crossOriginRect = null;
  };
  /**
   * Starts observing a target element for intersection changes based on
   * the thresholds values.
   * @param {Element} target The DOM element to observe.
   */


  IntersectionObserver.prototype.observe = function (target) {
    var isTargetAlreadyObserved = this._observationTargets.some(function (item) {
      return item.element == target;
    });

    if (isTargetAlreadyObserved) {
      return;
    }

    if (!(target && target.nodeType == 1)) {
      throw new Error('target must be an Element');
    }

    this._registerInstance();

    this._observationTargets.push({
      element: target,
      entry: null
    });

    this._monitorIntersections(target.ownerDocument);

    this._checkForIntersections();
  };
  /**
   * Stops observing a target element for intersection changes.
   * @param {Element} target The DOM element to observe.
   */


  IntersectionObserver.prototype.unobserve = function (target) {
    this._observationTargets = this._observationTargets.filter(function (item) {
      return item.element != target;
    });

    this._unmonitorIntersections(target.ownerDocument);

    if (this._observationTargets.length == 0) {
      this._unregisterInstance();
    }
  };
  /**
   * Stops observing all target elements for intersection changes.
   */


  IntersectionObserver.prototype.disconnect = function () {
    this._observationTargets = [];

    this._unmonitorAllIntersections();

    this._unregisterInstance();
  };
  /**
   * Returns any queue entries that have not yet been reported to the
   * callback and clears the queue. This can be used in conjunction with the
   * callback to obtain the absolute most up-to-date intersection information.
   * @return {Array} The currently queued entries.
   */


  IntersectionObserver.prototype.takeRecords = function () {
    var records = this._queuedEntries.slice();

    this._queuedEntries = [];
    return records;
  };
  /**
   * Accepts the threshold value from the user configuration object and
   * returns a sorted array of unique threshold values. If a value is not
   * between 0 and 1 and error is thrown.
   * @private
   * @param {Array|number=} opt_threshold An optional threshold value or
   *     a list of threshold values, defaulting to [0].
   * @return {Array} A sorted list of unique and valid threshold values.
   */


  IntersectionObserver.prototype._initThresholds = function (opt_threshold) {
    var threshold = opt_threshold || [0];
    if (!Array.isArray(threshold)) threshold = [threshold];
    return threshold.sort().filter(function (t, i, a) {
      if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
        throw new Error('threshold must be a number between 0 and 1 inclusively');
      }

      return t !== a[i - 1];
    });
  };
  /**
   * Accepts the rootMargin value from the user configuration object
   * and returns an array of the four margin values as an object containing
   * the value and unit properties. If any of the values are not properly
   * formatted or use a unit other than px or %, and error is thrown.
   * @private
   * @param {string=} opt_rootMargin An optional rootMargin value,
   *     defaulting to '0px'.
   * @return {Array<Object>} An array of margin objects with the keys
   *     value and unit.
   */


  IntersectionObserver.prototype._parseRootMargin = function (opt_rootMargin) {
    var marginString = opt_rootMargin || '0px';
    var margins = marginString.split(/\s+/).map(function (margin) {
      var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);

      if (!parts) {
        throw new Error('rootMargin must be specified in pixels or percent');
      }

      return {
        value: parseFloat(parts[1]),
        unit: parts[2]
      };
    }); // Handles shorthand.

    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];
    return margins;
  };
  /**
   * Starts polling for intersection changes if the polling is not already
   * happening, and if the page's visibility state is visible.
   * @param {!Document} doc
   * @private
   */


  IntersectionObserver.prototype._monitorIntersections = function (doc) {
    var win = doc.defaultView;

    if (!win) {
      // Already destroyed.
      return;
    }

    if (this._monitoringDocuments.indexOf(doc) != -1) {
      // Already monitoring.
      return;
    } // Private state for monitoring.


    var callback = this._checkForIntersections;
    var monitoringInterval = null;
    var domObserver = null; // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.

    if (this.POLL_INTERVAL) {
      monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
    } else {
      addEvent(win, 'resize', callback, true);
      addEvent(doc, 'scroll', callback, true);

      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
        domObserver = new win.MutationObserver(callback);
        domObserver.observe(doc, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }

    this._monitoringDocuments.push(doc);

    this._monitoringUnsubscribes.push(function () {
      // Get the window object again. When a friendly iframe is destroyed, it
      // will be null.
      var win = doc.defaultView;

      if (win) {
        if (monitoringInterval) {
          win.clearInterval(monitoringInterval);
        }

        removeEvent(win, 'resize', callback, true);
      }

      removeEvent(doc, 'scroll', callback, true);

      if (domObserver) {
        domObserver.disconnect();
      }
    }); // Also monitor the parent.


    if (doc != (this.root && this.root.ownerDocument || document)) {
      var frame = getFrameElement(doc);

      if (frame) {
        this._monitorIntersections(frame.ownerDocument);
      }
    }
  };
  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */


  IntersectionObserver.prototype._unmonitorIntersections = function (doc) {
    var index = this._monitoringDocuments.indexOf(doc);

    if (index == -1) {
      return;
    }

    var rootDoc = this.root && this.root.ownerDocument || document; // Check if any dependent targets are still remaining.

    var hasDependentTargets = this._observationTargets.some(function (item) {
      var itemDoc = item.element.ownerDocument; // Target is in this context.

      if (itemDoc == doc) {
        return true;
      } // Target is nested in this context.


      while (itemDoc && itemDoc != rootDoc) {
        var frame = getFrameElement(itemDoc);
        itemDoc = frame && frame.ownerDocument;

        if (itemDoc == doc) {
          return true;
        }
      }

      return false;
    });

    if (hasDependentTargets) {
      return;
    } // Unsubscribe.


    var unsubscribe = this._monitoringUnsubscribes[index];

    this._monitoringDocuments.splice(index, 1);

    this._monitoringUnsubscribes.splice(index, 1);

    unsubscribe(); // Also unmonitor the parent.

    if (doc != rootDoc) {
      var frame = getFrameElement(doc);

      if (frame) {
        this._unmonitorIntersections(frame.ownerDocument);
      }
    }
  };
  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */


  IntersectionObserver.prototype._unmonitorAllIntersections = function () {
    var unsubscribes = this._monitoringUnsubscribes.slice(0);

    this._monitoringDocuments.length = 0;
    this._monitoringUnsubscribes.length = 0;

    for (var i = 0; i < unsubscribes.length; i++) {
      unsubscribes[i]();
    }
  };
  /**
   * Scans each observation target for intersection changes and adds them
   * to the internal entries queue. If new entries are found, it
   * schedules the callback to be invoked.
   * @private
   */


  IntersectionObserver.prototype._checkForIntersections = function () {
    if (!this.root && crossOriginUpdater && !crossOriginRect) {
      // Cross origin monitoring, but no initial data available yet.
      return;
    }

    var rootIsInDom = this._rootIsInDom();

    var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

    this._observationTargets.forEach(function (item) {
      var target = item.element;
      var targetRect = getBoundingClientRect(target);

      var rootContainsTarget = this._rootContainsTarget(target);

      var oldEntry = item.entry;

      var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect);

      var newEntry = item.entry = new IntersectionObserverEntry({
        time: now(),
        target: target,
        boundingClientRect: targetRect,
        rootBounds: crossOriginUpdater && !this.root ? null : rootRect,
        intersectionRect: intersectionRect
      });

      if (!oldEntry) {
        this._queuedEntries.push(newEntry);
      } else if (rootIsInDom && rootContainsTarget) {
        // If the new entry intersection ratio has crossed any of the
        // thresholds, add a new entry.
        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
          this._queuedEntries.push(newEntry);
        }
      } else {
        // If the root is not in the DOM or target is not contained within
        // root but the previous entry for this target had an intersection,
        // add a new record indicating removal.
        if (oldEntry && oldEntry.isIntersecting) {
          this._queuedEntries.push(newEntry);
        }
      }
    }, this);

    if (this._queuedEntries.length) {
      this._callback(this.takeRecords(), this);
    }
  };
  /**
   * Accepts a target and root rect computes the intersection between then
   * following the algorithm in the spec.
   * TODO(philipwalton): at this time clip-path is not considered.
   * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
   * @param {Element} target The target DOM element
   * @param {Object} targetRect The bounding rect of the target.
   * @param {Object} rootRect The bounding rect of the root after being
   *     expanded by the rootMargin value.
   * @return {?Object} The final intersection rect object or undefined if no
   *     intersection is found.
   * @private
   */


  IntersectionObserver.prototype._computeTargetAndRootIntersection = function (target, targetRect, rootRect) {
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display == 'none') return;
    var intersectionRect = targetRect;
    var parent = getParentNode(target);
    var atRoot = false;

    while (!atRoot && parent) {
      var parentRect = null;
      var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {}; // If the parent isn't displayed, an intersection can't happen.

      if (parentComputedStyle.display == 'none') return null;

      if (parent == this.root || parent.nodeType ==
      /* DOCUMENT */
      9) {
        atRoot = true;

        if (parent == this.root || parent == document) {
          if (crossOriginUpdater && !this.root) {
            if (!crossOriginRect || crossOriginRect.width == 0 && crossOriginRect.height == 0) {
              // A 0-size cross-origin intersection means no-intersection.
              parent = null;
              parentRect = null;
              intersectionRect = null;
            } else {
              parentRect = crossOriginRect;
            }
          } else {
            parentRect = rootRect;
          }
        } else {
          // Check if there's a frame that can be navigated to.
          var frame = getParentNode(parent);
          var frameRect = frame && getBoundingClientRect(frame);

          var frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect);

          if (frameRect && frameIntersect) {
            parent = frame;
            parentRect = convertFromParentRect(frameRect, frameIntersect);
          } else {
            parent = null;
            intersectionRect = null;
          }
        }
      } else {
        // If the element has a non-visible overflow, and it's not the <body>
        // or <html> element, update the intersection rect.
        // Note: <body> and <html> cannot be clipped to a rect that's not also
        // the document rect, so no need to compute a new intersection.
        var doc = parent.ownerDocument;

        if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != 'visible') {
          parentRect = getBoundingClientRect(parent);
        }
      } // If either of the above conditionals set a new parentRect,
      // calculate new intersection data.


      if (parentRect) {
        intersectionRect = computeRectIntersection(parentRect, intersectionRect);
      }

      if (!intersectionRect) break;
      parent = parent && getParentNode(parent);
    }

    return intersectionRect;
  };
  /**
   * Returns the root rect after being expanded by the rootMargin value.
   * @return {ClientRect} The expanded root rect.
   * @private
   */


  IntersectionObserver.prototype._getRootRect = function () {
    var rootRect;

    if (this.root) {
      rootRect = getBoundingClientRect(this.root);
    } else {
      // Use <html>/<body> instead of window since scroll bars affect size.
      var html = document.documentElement;
      var body = document.body;
      rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
      };
    }

    return this._expandRectByRootMargin(rootRect);
  };
  /**
   * Accepts a rect and expands it by the rootMargin value.
   * @param {DOMRect|ClientRect} rect The rect object to expand.
   * @return {ClientRect} The expanded rect.
   * @private
   */


  IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
    var margins = this._rootMarginValues.map(function (margin, i) {
      return margin.unit == 'px' ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });

    var newRect = {
      top: rect.top - margins[0],
      right: rect.right + margins[1],
      bottom: rect.bottom + margins[2],
      left: rect.left - margins[3]
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;
    return newRect;
  };
  /**
   * Accepts an old and new entry and returns true if at least one of the
   * threshold values has been crossed.
   * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
   *    particular target element or null if no previous entry exists.
   * @param {IntersectionObserverEntry} newEntry The current entry for a
   *    particular target element.
   * @return {boolean} Returns true if a any threshold has been crossed.
   * @private
   */


  IntersectionObserver.prototype._hasCrossedThreshold = function (oldEntry, newEntry) {
    // To make comparing easier, an entry that has a ratio of 0
    // but does not actually intersect is given a value of -1
    var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
    var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1; // Ignore unchanged ratios

    if (oldRatio === newRatio) return;

    for (var i = 0; i < this.thresholds.length; i++) {
      var threshold = this.thresholds[i]; // Return true if an entry matches a threshold or if the new ratio
      // and the old ratio are on the opposite sides of a threshold.

      if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
        return true;
      }
    }
  };
  /**
   * Returns whether or not the root element is an element and is in the DOM.
   * @return {boolean} True if the root element is an element and is in the DOM.
   * @private
   */


  IntersectionObserver.prototype._rootIsInDom = function () {
    return !this.root || containsDeep(document, this.root);
  };
  /**
   * Returns whether or not the target element is a child of root.
   * @param {Element} target The target element to check.
   * @return {boolean} True if the target element is a child of root.
   * @private
   */


  IntersectionObserver.prototype._rootContainsTarget = function (target) {
    return containsDeep(this.root || document, target) && (!this.root || this.root.ownerDocument == target.ownerDocument);
  };
  /**
   * Adds the instance to the global IntersectionObserver registry if it isn't
   * already present.
   * @private
   */


  IntersectionObserver.prototype._registerInstance = function () {
    if (registry.indexOf(this) < 0) {
      registry.push(this);
    }
  };
  /**
   * Removes the instance from the global IntersectionObserver registry.
   * @private
   */


  IntersectionObserver.prototype._unregisterInstance = function () {
    var index = registry.indexOf(this);
    if (index != -1) registry.splice(index, 1);
  };
  /**
   * Returns the result of the performance.now() method or null in browsers
   * that don't support the API.
   * @return {number} The elapsed time since the page was requested.
   */


  function now() {
    return window.performance && performance.now && performance.now();
  }
  /**
   * Throttles a function and delays its execution, so it's only called at most
   * once within a given time period.
   * @param {Function} fn The function to throttle.
   * @param {number} timeout The amount of time that must pass before the
   *     function can be called again.
   * @return {Function} The throttled function.
   */


  function throttle(fn, timeout) {
    var timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(function () {
          fn();
          timer = null;
        }, timeout);
      }
    };
  }
  /**
   * Adds an event handler to a DOM node ensuring cross-browser compatibility.
   * @param {Node} node The DOM node to add the event handler to.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to add.
   * @param {boolean} opt_useCapture Optionally adds the even to the capture
   *     phase. Note: this only works in modern browsers.
   */


  function addEvent(node, event, fn, opt_useCapture) {
    if (typeof node.addEventListener == 'function') {
      node.addEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.attachEvent == 'function') {
      node.attachEvent('on' + event, fn);
    }
  }
  /**
   * Removes a previously added event handler from a DOM node.
   * @param {Node} node The DOM node to remove the event handler from.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to remove.
   * @param {boolean} opt_useCapture If the event handler was added with this
   *     flag set to true, it should be set to true here in order to remove it.
   */


  function removeEvent(node, event, fn, opt_useCapture) {
    if (typeof node.removeEventListener == 'function') {
      node.removeEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.detatchEvent == 'function') {
      node.detatchEvent('on' + event, fn);
    }
  }
  /**
   * Returns the intersection between two rect objects.
   * @param {Object} rect1 The first rect.
   * @param {Object} rect2 The second rect.
   * @return {?Object|?ClientRect} The intersection rect or undefined if no
   *     intersection is found.
   */


  function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;
    return width >= 0 && height >= 0 && {
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      width: width,
      height: height
    } || null;
  }
  /**
   * Shims the native getBoundingClientRect for compatibility with older IE.
   * @param {Element} el The element whose bounding rect to get.
   * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
   */


  function getBoundingClientRect(el) {
    var rect;

    try {
      rect = el.getBoundingClientRect();
    } catch (err) {// Ignore Windows 7 IE11 "Unspecified error"
      // https://github.com/w3c/IntersectionObserver/pull/205
    }

    if (!rect) return getEmptyRect(); // Older IE

    if (!(rect.width && rect.height)) {
      rect = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
    }

    return rect;
  }
  /**
   * Returns an empty rect object. An empty rect is returned when an element
   * is not in the DOM.
   * @return {ClientRect} The empty rect.
   */


  function getEmptyRect() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }
  /**
   * Ensure that the result has all of the necessary fields of the DOMRect.
   * Specifically this ensures that `x` and `y` fields are set.
   *
   * @param {?DOMRect|?ClientRect} rect
   * @return {?DOMRect}
   */


  function ensureDOMRect(rect) {
    // A `DOMRect` object has `x` and `y` fields.
    if (!rect || 'x' in rect) {
      return rect;
    } // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
    // for internally calculated Rect objects. For the purposes of
    // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
    // for these fields.


    return {
      top: rect.top,
      y: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }
  /**
   * Inverts the intersection and bounding rect from the parent (frame) BCR to
   * the local BCR space.
   * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
   * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
   * @return {ClientRect} The local root bounding rect for the parent's children.
   */


  function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
    var top = parentIntersectionRect.top - parentBoundingRect.top;
    var left = parentIntersectionRect.left - parentBoundingRect.left;
    return {
      top: top,
      left: left,
      height: parentIntersectionRect.height,
      width: parentIntersectionRect.width,
      bottom: top + parentIntersectionRect.height,
      right: left + parentIntersectionRect.width
    };
  }
  /**
   * Checks to see if a parent element contains a child element (including inside
   * shadow DOM).
   * @param {Node} parent The parent element.
   * @param {Node} child The child element.
   * @return {boolean} True if the parent node contains the child node.
   */


  function containsDeep(parent, child) {
    var node = child;

    while (node) {
      if (node == parent) return true;
      node = getParentNode(node);
    }

    return false;
  }
  /**
   * Gets the parent node of an element or its host element if the parent node
   * is a shadow root.
   * @param {Node} node The node whose parent to get.
   * @return {Node|null} The parent node or null if no parent exists.
   */


  function getParentNode(node) {
    var parent = node.parentNode;

    if (node.nodeType ==
    /* DOCUMENT */
    9 && node != document) {
      // If this node is a document node, look for the embedding frame.
      return getFrameElement(node);
    }

    if (parent && parent.nodeType == 11 && parent.host) {
      // If the parent is a shadow root, return the host element.
      return parent.host;
    }

    if (parent && parent.assignedSlot) {
      // If the parent is distributed in a <slot>, return the parent of a slot.
      return parent.assignedSlot.parentNode;
    }

    return parent;
  }
  /**
   * Returns the embedding frame element, if any.
   * @param {!Document} doc
   * @return {!Element}
   */


  function getFrameElement(doc) {
    try {
      return doc.defaultView && doc.defaultView.frameElement || null;
    } catch (e) {
      // Ignore the error.
      return null;
    }
  } // Exposes the constructors globally.


  window.IntersectionObserver = IntersectionObserver;
  window.IntersectionObserverEntry = IntersectionObserverEntry;
})();

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
function registCompleteSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registCompleteSectionObserver()] should be invoked on client side.');
  }

  if (!exports.completeSectionObserver) exports.completeSectionObserver = new SectionObserver(false, exports.Threshold.FULL);
  exports.completeSectionObserver.sectionObserve(ref, callback);
  return () => {
    exports.completeSectionObserver.sectionUnobserve(ref);
  };
}
function registHalfSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registHalfSectionObserver()] should be invoked on client side.');
  }

  if (!exports.halfSectionObserver) exports.halfSectionObserver = new SectionObserver(false, exports.Threshold.HALF);
  exports.halfSectionObserver.sectionObserve(ref, callback);
  return () => {
    exports.halfSectionObserver.sectionUnobserve(ref);
  };
}
function registMinSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registMinSectionObserver()] should be invoked on client side.');
  }

  if (!exports.minSectionObserver) exports.minSectionObserver = new SectionObserver(false, exports.Threshold.MIN);
  exports.minSectionObserver.sectionObserve(ref, callback);
  return () => {
    exports.minSectionObserver.sectionUnobserve(ref);
  };
}
function registRankSectionObserver(ref, callback) {
  if (!__CLIENT__) {
    throw new Error('[registRankSectionObserver()] should be invoked on client side.');
  }

  if (!exports.rankSectionObserver) exports.rankSectionObserver = new SectionObserver(true, exports.Threshold.FULL);
  exports.rankSectionObserver.sectionObserve(ref, callback);
  return () => {
    exports.rankSectionObserver.sectionUnobserve(ref);
  };
}
function resetSectionObserverStatus() {
  if (exports.completeSectionObserver) exports.completeSectionObserver.resetSectionObserver();
  if (exports.halfSectionObserver) exports.halfSectionObserver.resetSectionObserver();
  if (exports.minSectionObserver) exports.minSectionObserver.resetSectionObserver();
  if (exports.rankSectionObserver) exports.rankSectionObserver.resetSectionObserver();
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
exports.registCompleteSectionObserver = registCompleteSectionObserver;
exports.registHalfSectionObserver = registHalfSectionObserver;
exports.registMinSectionObserver = registMinSectionObserver;
exports.registRankSectionObserver = registRankSectionObserver;
exports.resetSectionObserverStatus = resetSectionObserverStatus;
exports.useCompleteSectionTracking = useCompleteSectionTracking;
exports.useHalfSectionTracking = useHalfSectionTracking;
exports.useMinSectionTracking = useMinSectionTracking;
exports.usePageTransitionListener = usePageTransitionListener;
exports.useRankSectionTracking = useRankSectionTracking;
//# sourceMappingURL=index.js.map
