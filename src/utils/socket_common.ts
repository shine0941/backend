// prettier-ignore
export interface SocketData {
  message: string,
}

// prettier-ignore
export interface ServerToClientEvents {
  serverMessage: (message: SocketData) => void;
  game: (message: SocketData) => void;
  continue: (message: SocketData) => void;
  selectGame: (message: SocketData) => void;
}

// prettier-ignore
export interface ClientToServerEvents {
  joinRoom: () => void;
  message: (data: SocketData) => void;
  selectGameCallBack: (data: SocketData) => void;
  gameCallBack: (data: SocketData) => void;
  continueCallBack: (data: SocketData) => void;
}
