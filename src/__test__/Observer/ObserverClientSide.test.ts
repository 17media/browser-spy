import {
  registCompleteSectionObserver,
  registHalfSectionObserver,
  registMinSectionObserver,
  registRankSectionObserver,
  completeSectionObserver,
  halfSectionObserver,
  minSectionObserver,
  rankSectionObserver,
} from '../../Observer';

jest.mock('../../utils/constants', () => {
  return {
    __CLIENT__: true,
  };
});

window.IntersectionObserver = jest.fn().mockImplementation(() => {
  return {
    observe: jest.fn(),
  };
});

const mockRef = { current: {} };
const mockCallback = () => {};

const sectionObserve = 'sectionObserve';
const sectionUnobserve = 'sectionUnobserve';
const resetSectionObserver = 'resetSectionObserver';

describe('Test [registCompleteSectionObserver], [registHalfSectionObserver], [registMinSectionObserver], [registRankSectionObserver]', () => {
  test('Should return corret object of CompleteSectionObserver', () => {
    registCompleteSectionObserver(mockRef, mockCallback);
    expect(completeSectionObserver?.elementMap.get(mockRef.current as Element)).toEqual(mockCallback);
    expect(completeSectionObserver).toHaveProperty(sectionObserve);
    expect(completeSectionObserver).toHaveProperty(sectionUnobserve);
    expect(completeSectionObserver).toHaveProperty(resetSectionObserver);
  });

  test('Should return corret object of HalfSectionObserver', () => {
    registHalfSectionObserver(mockRef, mockCallback);
    expect(halfSectionObserver?.elementMap.get(mockRef.current as Element)).toEqual(mockCallback);
    expect(halfSectionObserver).toHaveProperty(sectionObserve);
    expect(halfSectionObserver).toHaveProperty(sectionUnobserve);
    expect(halfSectionObserver).toHaveProperty(resetSectionObserver);
  });

  test('Should return corret object of MinSectionObserver', () => {
    registMinSectionObserver(mockRef, mockCallback);
    expect(minSectionObserver?.elementMap.get(mockRef.current as Element)).toEqual(mockCallback);
    expect(minSectionObserver).toHaveProperty(sectionObserve);
    expect(minSectionObserver).toHaveProperty(sectionUnobserve);
    expect(minSectionObserver).toHaveProperty(resetSectionObserver);
  });

  test('Should return corret object of RankSectionObserver', () => {
    registRankSectionObserver(mockRef, mockCallback);
    expect(rankSectionObserver?.elementMap.get(mockRef.current as Element)).toEqual(mockCallback);
    expect(rankSectionObserver).toHaveProperty(sectionObserve);
    expect(rankSectionObserver).toHaveProperty(sectionUnobserve);
    expect(rankSectionObserver).toHaveProperty(resetSectionObserver);
  });
});
