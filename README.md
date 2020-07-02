# Browser-Spy

Browser-Spy helps you to easily send tracking actions which defined by internal event team.

## Install

```
npm i https://github.com/17media/browser-spy.git
```

## Usage

```typescript
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

```typescript
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

```typescript
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

```typescript
completeSectionObserver;
halfSectionObserver;
minSectionObserver;
rankSectionObserver;
```

Usage:

```typescript
completeSectionObserver.sectionObserve(ReactRef, callback);
completeSectionObserver.sectionUnobserve(ReactRef, callback);
completeSectionObserver.resetSectionObserver();
```

### Hooks

We also encapsulate react hooks to make section tracking more easily, see [API section](#api) below for more detail.

```typescript
useCompleteSectionTracking(tabsRef, () => {
  trackingSource.track(createSectionViewAction('tabs'));
});
```

## API

### **_# Action creator_**

<hr/>

All creators return the `EventAction` object.

```
EventAction {
  eventName: string;
  category: string;
  trackingParams?: TrackingEventParams;
}
```

### **createButtonClickAction(buttonName, link)**

**Required**
| Parmeter | Type |
| - | - |
| `buttonName` | `string` |
| `link` | `string` |

### **createPageEnterAction(utmCampaign, utmContent, utmMedium, utmSource)**

The parameter `utm*` is obtained from the quer string, ex: `https://xxxx?utmCampaign=test&utmContent=test2`.
If the parameter doesn't exist, empty string is passed.

**Required**
| Parmeter | Type |
| - | - |
| `utmCampaign` | `string` |
| `utmContent` | `string` |
| `utmMedium` | `string` |
| `utmSource` | `string` |

### **createPageLeaveAction()**

**Required**
| Parmeter | Type |
| - | - |
| N/A | N/A |

### **createTabClickAction(link, tabName)**

**Required**
| Parmeter | Type |
| - | - |
| `link` | `string` |
| `tabName` | `string` |

### **createProfileClickAction(userID, liveStatus, profileType)**

**Required**
| Parmeter | Type |
| - | - |
| `userID` | `string` |
| `liveStatus` | `boolean` |
| `profileType` | `'topavatar' | 'avatar' as string` |

### **createSearchAction(keyword, count)**

**Required**
| Parmeter | Type |
| - | - |
| `keyword` | `string` |
| `count` | `number` |

### **createVoteAction(voteTopic)**

**Required**
| Parmeter | Type |
| - | - |
| `voteTopic` | `string` |

### **createLeaderboardSectionViewAction(rank)**

**Required**
| Parmeter | Type |
| - | - |
| `rank` | `number` |

### **createLinkClickAction(link, linkName)**

**Required**
| Parmeter | Type |
| - | - |
| `link` | `string` |
| `linkName` | `string` |

### **createSectionViewAction(section)**

**Required**
| Parmeter | Type |
| - | - |
| `section` | `'buttons' | 'duration' | 'gifts' | 'searchBar' | 'tabs' | 'description' | 'timeline' | 'topStreamer' as string` |

### **_# Hooks_**

<hr/>

These hooks are used for section tracking.

### **useCompleteSectionTracking(ref, callback)**

### **useHalfSectionTracking(ref, callback)**

### **useMinSectionTracking(ref, callback)**

### **useRankSectionTracking(ref, callback)**

**Required**
| Parmeter | Type |
| - | - | - |
| `ref: RefObject<any>` | `callback: Function` |

### **usePageTransitionListener(trackingSource, history)**

Reset observed items of observer and invoke `trackingSource.spyTransition` to send page_view event when history changing (such as `history.push`, etc).

**Required**
| Parmeter | Type |
| - | - | - |
| `trackingSource: DefaultSource` | `history: History` |
