import { RefObject } from 'react';
import { ElementMap, Threshold } from '../types';
import 'intersection-observer';

export class SectionObserver {
  public elementMap: ElementMap;

  private observer: IntersectionObserver | undefined;

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
