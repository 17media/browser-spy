import {
  getCompleteSectionObserver,
  getHalfSectionObserver,
  getMinSectionObserver,
  getRankSectionObserver,
} from '../../Observer';

jest.mock('../../utils/constants', () => {
  return {
    __CLIENT__: false,
  };
});

describe('Test [getCompleteSectionObserver], [getHalfSectionObserver], [getMinSectionObserver], [getRankSectionObserver]', () => {
  test('Should return undefined on server side. [getCompleteSectionObserver]', () => {
    const completeSectionObserver = getCompleteSectionObserver();
    expect(completeSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [getHalfSectionObserver]', () => {
    const halfSectionObserver = getHalfSectionObserver();
    expect(halfSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [getMinSectionObserver]', () => {
    const minSectionObserver = getMinSectionObserver();
    expect(minSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [getRankSectionObserver]', () => {
    const rankSectionObserver = getRankSectionObserver();
    expect(rankSectionObserver).toEqual(undefined);
  });
});
