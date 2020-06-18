// eslint-disable-next-line spaced-comment
/// <reference types="firebase" />

declare module 'intersection-observer' {}
declare interface Window {
  _paq: { push(args: any[]): void };
  firebase: typeof firebase;
}
