import { RefObject, useEffect } from 'react';
import { History } from 'history';
import { DefaultSource } from './Source';

import { completeSectionObserver, halfSectionObserver, minSectionObserver, rankSectionObserver } from './Observer';

export function useCompleteSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    completeSectionObserver.sectionObserve(ref, callback);
    return () => {
      completeSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function useHalfSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    halfSectionObserver.sectionObserve(ref, callback);
    return () => {
      halfSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function useMinSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    minSectionObserver.sectionObserve(ref, callback);
    return () => {
      minSectionObserver.sectionUnobserve(ref);
    };
  });
}

export function useRankSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
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
      completeSectionObserver.resetSectionObserver();
      halfSectionObserver.resetSectionObserver();
      minSectionObserver.resetSectionObserver();
      rankSectionObserver.resetSectionObserver();
    });
  }, [history]);
}
