import { EventEmitter } from 'events';

export interface DuelEvent {
  sessionId: string;
  stage: string;
  message: string;
  progress: number;
  timestamp: string;
  data?: Record<string, unknown>;
}

class DuelEventBus extends EventEmitter {
  emit(event: 'duel:progress', payload: DuelEvent): boolean;
  emit(event: string, payload: DuelEvent): boolean {
    return super.emit(event, payload);
  }

  broadcast(sessionId: string, stage: string, message: string, progress: number, data?: Record<string, unknown>) {
    const event: DuelEvent = {
      sessionId,
      stage,
      message,
      progress,
      timestamp: new Date().toISOString(),
      data,
    };
    this.emit('duel:progress', event);
  }
}

export const duelEvents = new DuelEventBus();
