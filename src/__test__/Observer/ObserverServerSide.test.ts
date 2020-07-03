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
    function regist() {
      registCompleteSectionObserver(mockRef, mockCallback);
    }
    expect(regist).toThrowError('[registCompleteSectionObserver()] should be invoked on client side.');
    expect(completeSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [registHalfSectionObserver]', () => {
    function regist() {
      registHalfSectionObserver(mockRef, mockCallback);
    }
    expect(regist).toThrowError('[registHalfSectionObserver()] should be invoked on client side.');
    expect(halfSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [registMinSectionObserver]', () => {
    function regist() {
      registMinSectionObserver(mockRef, mockCallback);
    }
    expect(regist).toThrowError('[registMinSectionObserver()] should be invoked on client side.');
    expect(minSectionObserver).toEqual(undefined);
  });

  test('Should return undefined on server side. [registRankSectionObserver]', () => {
    function regist() {
      registRankSectionObserver(mockRef, mockCallback);
    }
    expect(regist).toThrowError('[registRankSectionObserver()] should be invoked on client side.');
    expect(rankSectionObserver).toEqual(undefined);
  });
});
