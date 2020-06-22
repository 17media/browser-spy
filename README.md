# Browser-Spy

Browser-Spy helps you to easily send tracking actions which defined by internal event team.

## install

```
npm i https://github.com/17media/browser-spy.git
```

## Usage

```
const agent = {...}

// First, create the source instance and add agent.
// See Source section below for more detail.
const source = new DefaultSource();
source.addAgent(agent);

// Second, sending tracking action.
// See Action section below for more detail.
source.tarck(createXXXAction(...someParams));
```

### Source

Create `DefaultSource` instance for sending tracking event.

1. [Get Firebase configuration object](https://firebase.google.com/docs/projects/learn-more#config-files-objects) and create `firebaseAgentConfig` instance.
2. Create `DefaultSource` instance.
3. Add agent into source object.

```
import { FirebaseAgent, DefaultSource } from '17media-browser-spy';

const firebaseAgentConfig =
  process.env.NODE_ENV === 'prod'
    ? {
        // prod
        apiKey: '...',
        authDomain: '...',
        databaseURL: '...',
        projectId: '...',
        storageBucket: '...',
        messagingSenderId: '...',
        appId: '...',
        measurementId: '...',
      }
    : {
        // stage
        apiKey: '...',
        authDomain: '...',
        databaseURL: '...',
        projectId: '...',
        storageBucket: '...',
        messagingSenderId: '...',
        appId: '...',
        measurementId: '...',
      };

const agent = new FirebaseAgent(firebaseAgentConfig);

const source = new DefaultSource();
source.addAgent(agent);

export const trackingSource = source;

```

### Action

**_Action creator_**

Returning an object which contains the tracking event parameters, which should be used with `source.track()`, see [API section](#api) below for more detail.

```
// expample

import { trackingSource } from 'somewhere in your code';
import { createSectionViewAction } from '17media-browser-spy'

...
// sending tracking data in somewhere
trackingSource.track(createSectionViewAction('xxx_section'));
...
```

### Section Observers

Customized `window.IntersectionObserver` for event page section tracking, there are 4 section observers for intersection of various sizes on the viewport.

```
completeSectionObserver
halfSectionObserver
minSectionObserver
rankSectionObserver
```

Usage:

```
completeSectionObserver.sectionObserve(ReactRef, callback);
completeSectionObserver.sectionUnobserve(ReactRef, callback);
completeSectionObserver.resetSectionObserver();
```

### Hooks

We also encapsulate react hooks to make section tracking more easily, see [API section](#api) below for more detail.

```
useCompleteSectionTracking(tabsRef, () => {
  trackingSource.track(createSectionViewAction('tabs'));
});
```

## API

**_Action creator_**

All creators return the `EventAction` object.

| Name                                                                   | Parameter                                                                                                            | description                                                                                                                      |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `createButtonClickAction(buttonName, link)`                            | **Required:** <br> `buttonName: string` <br> `link: string`                                                          | Passing button name and full-link for tracking.                                                                                  |
| `createPageEnterAction(utmCampaign, utmContent, utmMedium, utmSource)` | **Required:** <br> `utmCampaign: string` <br> `utmContent: string` <br> `utmMedium: string` <br> `utmSource: string` | N/A                                                                                                                              |
| `createPageLeaveAction()`                                              | **Required:** <br> N/A                                                                                               | N/A                                                                                                                              |
| `createTabClickAction(link, tabName)`                                  | **Required:** <br> `link: string` <br> `tabName: string`                                                             | N/A                                                                                                                              |
| `createProfileClickAction(userID, liveStatus, profileType)`            | **Required:** <br> `userID: string` <br> `liveStatus: boolean` <br> `profileType: ProfileName`                       | ProfileName only accept the string `topavatar` or `avatar`                                                                       |
| `createSearchAction(keyword, count)`                                   | **Required:** <br> `keyword: string` <br> `count: number`                                                            | N/A                                                                                                                              |
| `createVoteAction(voteTopic)`                                          | **Required:** <br> `voteTopic: string`                                                                               | N/A                                                                                                                              |
| `createLeaderboardSectionViewAction(rank)`                             | **Required:** <br> `rank: number`                                                                                    | N/A                                                                                                                              |
| `createLinkClickAction(link, linkName)`                                | **Required:** <br> `link: string` <br> `linkName: string`                                                            | N/A                                                                                                                              |
| `createSectionViewAction(section)`                                     | **Required:** <br> `section: SectionName`                                                                            | SectionName only accept the string `buttons`, `duration`, `gifts`, `searchBar`, `tabs`, `description`, `timeline`, `topStreamer` |

**_Hooks_**

| Name                                                                                                                  | Parameter                                                          | description                                      |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `useCompleteSectionTracking` <br> `useHalfSectionTracking` <br> `useMinSectionTracking` <br> `useRankSectionTracking` | **Required:** <br> `ref: RefObject<any>` <br> `callback: Function` | These hooks are used to sending section tracking |
