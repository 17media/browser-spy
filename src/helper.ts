import { RefObject } from 'react';

import { SectionObserver } from './lib/Observer';
import { DefaultSource } from './lib/Source';
import { FirebaseAgent } from './lib/Agent';
import { __CLIENT__ } from './utils/constants';
import { Threshold } from './types';

export let completeSectionObserver: SectionObserver | undefined;
export let halfSectionObserver: SectionObserver | undefined;
export let minSectionObserver: SectionObserver | undefined;
export let rankSectionObserver: SectionObserver | undefined;

export function registCompleteSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    throw new Error('[registCompleteSectionObserver()] should be invoked on client side.');
  }
  if (!completeSectionObserver) completeSectionObserver = new SectionObserver(false, Threshold.FULL);
  completeSectionObserver.sectionObserve(ref, callback);
  return () => {
    completeSectionObserver!.sectionUnobserve(ref);
  };
}

export function registHalfSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    throw new Error('[registHalfSectionObserver()] should be invoked on client side.');
  }

  if (!halfSectionObserver) halfSectionObserver = new SectionObserver(false, Threshold.HALF);
  halfSectionObserver.sectionObserve(ref, callback);
  return () => {
    halfSectionObserver!.sectionUnobserve(ref);
  };
}

export function registMinSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    throw new Error('[registMinSectionObserver()] should be invoked on client side.');
  }

  if (!minSectionObserver) minSectionObserver = new SectionObserver(false, Threshold.MIN);
  minSectionObserver.sectionObserve(ref, callback);
  return () => {
    minSectionObserver!.sectionUnobserve(ref);
  };
}

export function registRankSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    throw new Error('[registRankSectionObserver()] should be invoked on client side.');
  }

  if (!rankSectionObserver) rankSectionObserver = new SectionObserver(true, Threshold.FULL);
  rankSectionObserver.sectionObserve(ref, callback);
  return () => {
    rankSectionObserver!.sectionUnobserve(ref);
  };
}

export function resetSectionObserverStatus() {
  if (completeSectionObserver) completeSectionObserver.resetSectionObserver();
  if (halfSectionObserver) halfSectionObserver.resetSectionObserver();
  if (minSectionObserver) minSectionObserver.resetSectionObserver();
  if (rankSectionObserver) rankSectionObserver.resetSectionObserver();
}

export function createFirebaseTrackingSource(firebaseAgentConfig: any) {
  let source: DefaultSource | undefined;
  let agent: FirebaseAgent | undefined;
  if (__CLIENT__) {
    agent = new FirebaseAgent(firebaseAgentConfig);
    source = new DefaultSource();
    source.addAgent(agent);
  }
  return source;
}
