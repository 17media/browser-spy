import { RefObject, useEffect } from 'react';

import { completeSectionObserver, halfSectionObserver, minSectionObserver, rankSectionObserver } from './Observer';

export const useCompleteSectionTracking = (ref: RefObject<any>, callback: Function) => {
  useEffect(() => {
    if (ref.current === null) return;
    completeSectionObserver.sectionObserve(ref, callback);
    return () => {
      completeSectionObserver.sectionUnobserve(ref);
    };
  });
};

export const useHalfSectionTracking = (ref: RefObject<any>, callback: Function) => {
  useEffect(() => {
    if (ref.current === null) return;
    halfSectionObserver.sectionObserve(ref, callback);
    return () => {
      halfSectionObserver.sectionUnobserve(ref);
    };
  });
};

export const useMinSectionTracking = (ref: RefObject<any>, callback: Function) => {
  useEffect(() => {
    if (ref.current === null) return;
    minSectionObserver.sectionObserve(ref, callback);
    return () => {
      minSectionObserver.sectionUnobserve(ref);
    };
  });
};

export const useRankSectionTracking = (ref: RefObject<any>, callback: Function) => {
  useEffect(() => {
    if (ref.current === null) return;
    rankSectionObserver.sectionObserve(ref, callback);
    return () => {
      rankSectionObserver.sectionUnobserve(ref);
    };
  });
};

export function testing() {
  rankSectionObserver.sectionObserve({} as RefObject<any>, () => {});
}
