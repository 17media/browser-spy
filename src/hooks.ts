import { RefObject, useEffect } from 'react';
import { History } from 'history';
import { DefaultSource } from './lib/Source';

import {
  registCompleteSectionObserver,
  registHalfSectionObserver,
  registMinSectionObserver,
  registRankSectionObserver,
  resetSectionObserverStatus,
} from './helper';

export function useCompleteSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    return registCompleteSectionObserver(ref, callback);
  });
}

export function useHalfSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    return registHalfSectionObserver(ref, callback);
  });
}

export function useMinSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    return registMinSectionObserver(ref, callback);
  });
}

export function useRankSectionTracking(ref: RefObject<any>, callback: Function) {
  useEffect(() => {
    if (ref.current === null) return;
    return registRankSectionObserver(ref, callback);
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
