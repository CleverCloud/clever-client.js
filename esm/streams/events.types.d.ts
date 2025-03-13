export interface WebSocketLike {
  addEventListener(type: EventType, listener: EventListener): void;
  removeEventListener(type: EventType, listener: EventListener): void;
  send(message: any): void;
}

type EventType = 'open' | 'message' | 'close' | 'error';
type EventListener = (event: { data: any }) => void;
