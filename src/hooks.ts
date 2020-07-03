import { RefObject, useEffect } from 'react';
import { History } from 'history';
import { DefaultSource } from './Source';

import {
  registCompleteSectionObserver,
  registHalfSectionObserver,
  registMinSectionObserver,
  registRankSectionObserver,
  resetSectionObserverStatus,
} from './Observer';

export function useCompleteSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    const unobserve = registCompleteSectionObserver(ref, callback);
    return () => {
      if (unobserve) unobserve();
    };
  });
}

export function useHalfSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    const unobserve = registHalfSectionObserver(ref, callback);
    return () => {
      if (unobserve) unobserve();
    };
  });
}

export function useMinSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    const unobserve = registMinSectionObserver(ref, callback);
    return () => {
      if (unobserve) unobserve();
    };
  });
}

export function useRankSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    const unobserve = registRankSectionObserver(ref, callback);
    return () => {
      if (unobserve) unobserve();
    };
  });
}

export function usePageTransitionListener(trackingSource: DefaultSource, history: History) {
  useEffect(() => {
    // Regist history (for page_view & screen_view)
    trackingSource.spyTransition(history);
    history.listen(() => {
      resetSectionObserverStatus();
    });
  }, [history]);
}
