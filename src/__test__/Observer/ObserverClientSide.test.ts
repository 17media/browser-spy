import {
  getCompleteSectionObserver,
  getHalfSectionObserver,
  getMinSectionObserver,
  getRankSectionObserver,
} from '../../Observer';

jest.mock('../../utils/constants', () => {
  return {
    __CLIENT__: true,
  };
});

const sectionObserve = 'sectionObserve';
const sectionUnobserve = 'sectionUnobserve';
const resetSectionObserver = 'resetSectionObserver';

describe('Test [getCompleteSectionObserver], [getHalfSectionObserver], [getMinSectionObserver], [getRankSectionObserver]', () => {
  test('Should return corret object of CompleteSectionObserver', () => {
    const completeSectionObserver = getCompleteSectionObserver();
    expect(completeSectionObserver).toHaveProperty(sectionObserve);
    expect(completeSectionObserver).toHaveProperty(sectionUnobserve);
    expect(completeSectionObserver).toHaveProperty(resetSectionObserver);
  });

  test('Should return corret object of HalfSectionObserver', () => {
    const halfSectionObserver = getHalfSectionObserver();
    expect(halfSectionObserver).toHaveProperty(sectionObserve);
    expect(halfSectionObserver).toHaveProperty(sectionUnobserve);
    expect(halfSectionObserver).toHaveProperty(resetSectionObserver);
  });

  test('Should return corret object of MinSectionObserver', () => {
    const minSectionObserver = getMinSectionObserver();
    expect(minSectionObserver).toHaveProperty(sectionObserve);
    expect(minSectionObserver).toHaveProperty(sectionUnobserve);
    expect(minSectionObserver).toHaveProperty(resetSectionObserver);
  });

  test('Should return corret object of RankSectionObserver', () => {
    const rankSectionObserver = getRankSectionObserver();
    expect(rankSectionObserver).toHaveProperty(sectionObserve);
    expect(rankSectionObserver).toHaveProperty(sectionUnobserve);
    expect(rankSectionObserver).toHaveProperty(resetSectionObserver);
  });
});
