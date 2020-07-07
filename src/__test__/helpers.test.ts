import { createFirebaseTrackingSource } from '../helper';

jest.mock('../utils/constants', () => {
  return {
    __CLIENT__: true,
  };
});

window.IntersectionObserver = jest.fn().mockImplementation(() => {
  return {
    observe: jest.fn(),
  };
});

describe('helper test', () => {
  test('[createFirebaseTrackingSource] Should return corret object of trackingSource', () => {
    const source = createFirebaseTrackingSource({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
    });
    expect(source).toHaveProperty('addAgent');
    expect(source).toHaveProperty('spyTransition');
    expect(source).toHaveProperty('spyClick');
    expect(source).toHaveProperty('spyPageDurationByVisible');
    expect(source).toHaveProperty('spyPageDurationByTransition');
    expect(source).toHaveProperty('login');
    expect(source).toHaveProperty('transit');
    expect(source).toHaveProperty('track');
  });
});
