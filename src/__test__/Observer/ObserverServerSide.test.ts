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
    __CLIENT__: false,
  };
});

window.IntersectionObserver = jest.fn().mockImplementation(() => {
  return {
    observe: () => null,
  };
});

const mockRef = { current: {} };
const mockCallback = () => {};

describe('Test [registCompleteSectionObserver], [registHalfSectionObserver], [registMinSectionObserver], [registRankSectionObserver]', () => {
  test('Should return undefined on server side. [registCompleteSectionObserver]', () => {
    registCompleteSectionObserver(mockRef, mockCallback);
    expect(completeSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [registHalfSectionObserver]', () => {
    registHalfSectionObserver(mockRef, mockCallback);
    expect(halfSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [registMinSectionObserver]', () => {
    registMinSectionObserver(mockRef, mockCallback);
    expect(minSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [registRankSectionObserver]', () => {
    registRankSectionObserver(mockRef, mockCallback);
    expect(rankSectionObserver).toEqual(undefined);
  });
});
