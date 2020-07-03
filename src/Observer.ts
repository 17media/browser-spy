import { RefObject } from 'react';
import { ElementMap, Threshold } from './types';
import { __CLIENT__ } from './utils/constants';
import 'intersection-observer';

class SectionObserver {
  private observer: IntersectionObserver | undefined;

  private elementMap: ElementMap;

  private debounceExecute = 0;

  constructor(debounce: boolean, threshold: Threshold) {
    this.elementMap = new Map();
    try {
      this.observer = new window.IntersectionObserver(
        entries => {
          if (debounce) {
            this.debounceSectionIntersect(entries);
          } else {
            this.sectionIntersect(entries);
          }
        },
        {
          threshold: [threshold],
        },
      );
    } catch (error) {
      console.log(`Error occur when creating IntersectionObserver: ${error}`);
    }
  }

  sectionObserve = (ref: RefObject<any>, callback: Function) => {
    this.observer?.observe(ref.current);
    this.elementMap.set(ref.current, callback);
  };

  sectionUnobserve = (ref: RefObject<any>) => {
    this.observer?.unobserve(ref.current);
    if (this.elementMap.has(ref.current)) this.elementMap.delete(ref.current);
  };

  resetSectionObserver = () => {
    this.elementMap.forEach((value, key) => {
      this.observer?.observe(key);
    });
  };

  private sectionIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const { target } = entry;
      if (entry.isIntersecting && this.elementMap.has(target)) {
        const callback = this.elementMap.get(target);
        if (!callback) return;

        callback();

        this.observer?.unobserve(target);
      }
    });
  };

  private debounceSectionIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const { target } = entry;
      if (entry.isIntersecting && this.elementMap.has(target)) {
        const callback = this.elementMap.get(target);
        if (!callback) return;

        clearTimeout(this.debounceExecute);
        this.debounceExecute = window.setTimeout(() => {
          callback();
        }, 1000);

        this.observer?.unobserve(target);
      }
    });
  };
}

// Export for test.
export let completeSectionObserver: SectionObserver | undefined;
export let halfSectionObserver: SectionObserver | undefined;
export let minSectionObserver: SectionObserver | undefined;
export let rankSectionObserver: SectionObserver | undefined;

export function registCompleteSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    console.error('[registCompleteSectionObserver()] should be invoked on client side.');
    return;
  }
  if (!completeSectionObserver) completeSectionObserver = new SectionObserver(false, Threshold.FULL);
  completeSectionObserver.sectionObserve(ref, callback);
  return () => {
    completeSectionObserver!.sectionUnobserve(ref);
  };
}

export function registHalfSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    console.error('[registHalfSectionObserver()] should be invoked on client side.');
    return;
  }

  if (!halfSectionObserver) halfSectionObserver = new SectionObserver(false, Threshold.HALF);
  halfSectionObserver.sectionObserve(ref, callback);
  return () => {
    halfSectionObserver!.sectionUnobserve(ref);
  };
}

export function registMinSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    console.error('[registMinSectionObserver()] should be invoked on client side.');
    return;
  }

  if (!minSectionObserver) minSectionObserver = new SectionObserver(false, Threshold.MIN);
  minSectionObserver.sectionObserve(ref, callback);
  return () => {
    minSectionObserver!.sectionUnobserve(ref);
  };
}

export function registRankSectionObserver(ref: RefObject<any>, callback: Function) {
  if (!__CLIENT__) {
    console.error('[registRankSectionObserver()] should be invoked on client side.');
    return;
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
