export interface SseLike {
  addEventListener(type: string, listener: EventListener): void
  close(): void;
}

type EventListener = (event: {data: any}) => void;
