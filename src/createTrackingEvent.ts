import { TrackingEvent } from './TrackingEvent';
import { createDefaultEventParams } from './utils/param';

export function createTrackingEvent(event: Omit<TrackingEvent, 'type' | '$$type'>) {
  return {
    ...event,
    payload: { ...createDefaultEventParams(), ...event.payload },
    type: 'tracking',
    $$type: 'TrackingEvent',
  } as TrackingEvent;
}
