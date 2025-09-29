// prettier-ignore
export interface SocketData {
  message: string,
}

// prettier-ignore
export interface ServerToClientEvents {
  'server:message': (message: SocketData) => void;
  'server:game': (message: SocketData) => void;
  'server:continue': (message: SocketData) => void;
  'server:selectGame': (message: SocketData) => void;
}

// prettier-ignore
export interface ClientToServerEvents {
  'client:joinRoom': () => void;
  'client:message': (data: SocketData) => void;
  'client:selectGameCallBack': (data: SocketData) => void;
  'client:gameCallBack': (data: SocketData) => void;
  'client:continueCallBack': (data: SocketData) => void;
}
