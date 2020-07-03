import { RefObject, useEffect } from 'react';
import { History } from 'history';
import { DefaultSource } from './Source';

import {
  getCompleteSectionObserver,
  getHalfSectionObserver,
  getMinSectionObserver,
  getRankSectionObserver,
} from './Observer';

const completeSectionObserver = getCompleteSectionObserver();
const halfSectionObserver = getHalfSectionObserver();
const minSectionObserver = getMinSectionObserver();
const rankSectionObserver = getRankSectionObserver();

export function useCompleteSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null || !completeSectionObserver) return;
    completeSectionObserver.sectionObserve(ref, callback);
    return () => {
      completeSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function useHalfSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null || !halfSectionObserver) return;
    halfSectionObserver.sectionObserve(ref, callback);
    return () => {
      halfSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function useMinSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null || !minSectionObserver) return;
    minSectionObserver.sectionObserve(ref, callback);
    return () => {
      minSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function useRankSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null || !rankSectionObserver) return;
    rankSectionObserver.sectionObserve(ref, callback);
    return () => {
      rankSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function usePageTransitionListener(trackingSource: DefaultSource, history: History) {
  useEffect(() => {
    // Regist history (for page_view & screen_view)
    trackingSource.spyTransition(history);
    history.listen(() => {
      if (completeSectionObserver) completeSectionObserver.resetSectionObserver();
      if (halfSectionObserver) halfSectionObserver.resetSectionObserver();
      if (minSectionObserver) minSectionObserver.resetSectionObserver();
      if (rankSectionObserver) rankSectionObserver.resetSectionObserver();
    });
  }, [history]);
}
