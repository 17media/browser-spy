import { TransitionEvent, TrackingEvent, TrackingEventParams, Scene, SpyEvent } from 'types';
import { Agent } from 'Agent';
import { History } from 'history';
import * as dom from 'utils/dom';
import { createScene, createDefaultEventParams } from 'utils/param';
import { TrackingEvent as V2TrackingEvent, isTrackingEvent as isV2TrackingEvent } from './TrackingEvent';

export interface Source {
  addAgent(agent: Agent): void;
}

export class DefaultSource implements Source {
  private agents: Agent[] = [];

  private currentScene: Scene = createScene();

  addAgent(agent: Agent) {
    agent.initialize();
    this.agents.push(agent);
  }

  spyTransition(history: History) {
    // wait for whole page updated
    // init page_view
    setTimeout(() => this.transit(createScene()), 100);
    history.listen(() => {
      const { action } = history;
      // Filtering replace action (The pushed url is not matching, ex: Redirect)
      if (action === 'PUSH') {
        setTimeout(() => this.transit(createScene()), 100);
      }
    });
  }

  spyClick() {
    window.addEventListener('click', event => {
      const { target } = event;
      if (target instanceof HTMLElement) {
        this.track({
          eventName: 'click',
          category: 'default',
          trackingParams: {
            name: dom.getContent(target),
            value: '',
            role: dom.guessRole(target),
          },
        });
      }
    });
  }

  // tracking page visibility. e.g. page minimized, change browser tab or page unload
  spyPageDurationByVisible(params?: TrackingEventParams) {
    let startDurationTime: number = 0;

    const handleVisibleChange = (e: Event) => {
      if (document.visibilityState === 'hidden') {
        const endDurationTime = e.timeStamp;
        const duration = Math.floor(endDurationTime - startDurationTime);
        this.track({
          eventName: 'pageView',
          category: 'default',
          trackingParams: {
            url: window.location.href,
            duration,
            ...params,
          },
        });
      }
      if (document.visibilityState === 'visible') {
        startDurationTime = e.timeStamp;
      }
    };
    document.addEventListener('visibilitychange', handleVisibleChange);
  }

  spyPageDurationByTransition(history: History, params?: TrackingEventParams) {
    let startDurationTime: number = Date.now();
    let url = window.location.href;
    history.listen(() => {
      const endDurationTime: number = Date.now();
      const duration = Math.floor(endDurationTime - startDurationTime);
      this.track({
        eventName: 'pageView',
        category: 'default',
        trackingParams: {
          url,
          duration,
          ...params,
        },
      });
      startDurationTime = endDurationTime;
      url = window.location.href;
    });
  }

  login(userId: string) {
    this.report({ type: 'login', userId });
  }

  transit(toScene: Scene) {
    const fromScene = this.currentScene;
    const event: TransitionEvent = {
      type: 'transition',
      fromScene,
      toScene,
      defaultTrackingParams: createDefaultEventParams(),
    };
    this.report(event);
  }

  track(event: Omit<TrackingEvent, 'type'> | V2TrackingEvent) {
    if (isV2TrackingEvent(event)) {
      this.report(event);
      return;
    }
    const { trackingParams } = event;
    const defaultParams = trackingParams?.hasOwnProperty('productName') ? {} : createDefaultEventParams();
    const mergedTrackingParams = {
      ...defaultParams,
      ...trackingParams,
    };
    event.trackingParams = mergedTrackingParams;
    this.report({ type: 'tracking', ...event });
  }

  private report(event: SpyEvent) {
    this.agents.forEach(agent => {
      try {
        agent.report(event);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
