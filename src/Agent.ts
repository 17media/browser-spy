/* eslint-disable @typescript-eslint/camelcase */
import { loadScript, loadScripts } from 'utils/loadScript';
import * as object from 'utils/object';
import { TrackingEvent, TransitionEvent, LoginEvent, SpyEvent } from 'types';

enum AgentState {
  Uninitialized,
  Initializing,
  Initialized,
  InitializeFail,
}

export abstract class Agent {
  protected state = AgentState.Uninitialized;

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

  abstract report(event: SpyEvent): void;

  protected abstract doInitialize(): Promise<void> | void;
}

let isInit = false;

export class FirebaseAgent extends Agent {
  private client!: firebase.analytics.Analytics;

  private queue: Array<() => void> = [];

  /**
   * @param config @see https://support.google.com/firebase/answer/7015592
   */
  constructor(readonly config: any) {
    super();
  }

  async doInitialize() {
    await loadScripts(
      'https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js',
      'https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js',
    );

    // TODO del
    // const firebase = await import('firebase/app');
    // await import('firebase/analytics');

    if (!isInit) {
      this.client = firebase.initializeApp(this.config).analytics();
      isInit = true;
    } else {
      this.client = firebase.analytics();
    }

    this.queue.forEach(callback => callback());

    this.queue = [];
  }

  report(event: SpyEvent) {
    this.queueIfNotInitialized(() => this.doReport(event));
  }

  private doReport(event: SpyEvent) {
    switch (event.type) {
      case 'login':
        return this.login(event);
      case 'tracking':
        return this.track(event);
      case 'transition':
        return this.transit(event);
      default:
        break;
    }
  }

  private login(event: LoginEvent) {
    const { userId } = event;
    this.client.setUserId(userId, { global: true });
    if (userId) this.client.logEvent('login', { userId });
  }

  private transit(event: TransitionEvent) {
    const { toScene, defaultTrackingParams } = event;
    const { title, hostname, pathname } = toScene;
    this.client.logEvent('page_view', {
      page_title: title,
      page_location: hostname,
      page_path: pathname,
      ...object.convertParamsToSankecase(defaultTrackingParams),
    });
    this.client.setCurrentScreen(event.toScene.title, { global: true });
  }

  private track(event: TrackingEvent) {
    const { eventName, trackingParams = {} } = event;
    object.trim(trackingParams);
    this.client.logEvent(eventName, object.convertParamsToSankecase(trackingParams));
  }

  private queueIfNotInitialized(callback: () => void) {
    if (this.state === AgentState.Initialized) callback();
    else this.queue.push(callback);
  }
}

export interface MatomoAgentConfig {
  endpoint: string;
  siteId: string;
}

export class MatomoAgent extends Agent {
  private client = window._paq; // eslint-disable-line no-underscore-dangle

  private trackPageViewTimer = 0;

  private intialized = false;

  constructor(readonly config: MatomoAgentConfig) {
    super();
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

  report(event: SpyEvent) {
    switch (event.type) {
      case 'login':
        return this.login(event);
      case 'tracking':
        return this.track(event);
      case 'transition':
        return this.transit(event);
      default:
        break;
    }
  }

  private login(event: LoginEvent) {
    const { userId } = event;
    if (userId) this.client.push(['setUserId', userId]);
    else this.client.push(['resetUserId']);
    this.requestTrackPageView();
  }

  private transit(event: TransitionEvent) {
    const { fromScene, toScene } = event;
    this.client.push(['setReferrerUrl', `${fromScene.hostname}${fromScene.pathname}`]);
    this.client.push(['setCustomUrl', `${toScene.hostname}${fromScene.pathname}`]);
    this.client.push(['setDocumentTitle', toScene.title]);
    this.client.push(['setGenerationTimeMs', 0]);
    this.requestTrackPageView();
    this.client.push(['enableLinkTracking']);
    this.client.push(['trackAllContentImpressions']);
  }

  private track(event: TrackingEvent) {
    /**
     * ref : https://developer.matomo.org/guides/tracking-javascript
     * trackEvent(category, action, [name], [value]) -
     * Log an event with an event category (Videos, Music, Games...), an event action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...), and an optional event name and optional numeric value.
     */
    const { eventName, category, trackingParams = {} } = event;
    const { name = '', value = '' } = trackingParams;
    this.client.push(['trackEvent', category, eventName, name, value]);
  }

  private requestTrackPageView() {
    if (this.trackPageViewTimer) clearTimeout(this.trackPageViewTimer);
    this.trackPageViewTimer = setTimeout(() => {
      this.client.push(['trackPageView']);
      this.trackPageViewTimer = 0;
    });
  }
}
