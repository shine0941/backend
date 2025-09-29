import { Socket, Server } from "socket.io";
import { createServer } from "http";
import { NumberGamesBase, GameMessage } from "./number_games_base";
import { GuessNumber } from "./guess_number";
import { SecretNumber } from "./secret_number";
import {
  SocketData,
  ServerToClientEvents,
  ClientToServerEvents,
} from "./utils/socket_common";

// prettier-ignore
interface ClientGameDictionary {
  [key: string]: NumberGamesBase,
}

export class SocketGameServer {
  private socketServer = new Server();
  private gameObjects: ClientGameDictionary = {};
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;

    this.setupSocketServerHandlers();
  }

  public start(): void {
    console.log("number games socket server is running");
    this.socketServer.listen(this.port);
  }

  private setupSocketServerHandlers(): void {
    const httpServer = createServer();
    this.socketServer = new Server<ServerToClientEvents, ClientToServerEvents>(
      httpServer,
      {}
    );

    // handler connection events
    this.socketServer.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      const roomId = `room_${socket.id}`;

      // join room
      this.joinRoomHandler(socket, roomId);

      // client message handler
      this.messageHandler(socket, roomId);

      // select-game callback
      this.selectGameHandler(socket, roomId);

      // game callback
      this.gameHandler(socket, roomId);

      // continue callback
      this.continueHandler(socket, roomId);
    });
  }

  // client to server event handlers
  private joinRoomHandler(socket: Socket, roomId: string): void {
    socket.once("joinRoom", () => {
      socket.join(roomId);

      this.messageSender(roomId, `you joined room ${roomId}`);

      this.selectGameSender(roomId);
    });
  }

  private messageHandler(socket: Socket, roomId: string): void {
    socket.on("message", (data: SocketData) => {
      console.log(`[message](${roomId})=>${data.message}`);
    });
  }

  private selectGameHandler(socket: Socket, roomId: string): void {
    socket.on("selectGameCallBack", (data: SocketData) => {
      const gameInput = data.message;

      console.log(`[selectGameCallBack](${roomId})=>${gameInput}`);
      this.messageSender(roomId, `you selected game:${gameInput}`);

      // valid game input
      if (NumberGamesBase.isValidGameId(gameInput) === true) {
        // valid game-id and init game
        this.gameObjects[roomId] = this.gameInit(gameInput);

        // game start message
        this.messageSender(roomId, this.gameObjects[roomId].gameStartMessage());

        // game start
        let gameMessage: GameMessage;
        gameMessage = this.gameObjects[roomId].gameStart();

        this.gameSender(roomId, this.getGameMessage(gameMessage));
      } else {
        // invalid game id and request again
        this.messageSender(roomId, `invalid game input`);

        this.selectGameSender(roomId);
      }
    });
  }

  private gameHandler(socket: Socket, roomId: string): void {
    socket.on("gameCallBack", (data: SocketData) => {
      const answer = data.message;
      const gameObject = this.gameObjects[roomId];

      console.log(`[gameCallBack](${roomId}):${answer}`);

      let gameMessage: GameMessage;
      gameMessage = gameObject.guess(answer);

      // checking game status
      if (gameObject.isPlaying) {
        this.gameSender(roomId, this.getGameMessage(gameMessage));

        return;
      }

      // game end case
      if (gameMessage.isCorrect === true) {
        this.messageSender(roomId, gameObject.gameWinMessage());
      } else {
        this.messageSender(roomId, gameObject.gameLoseMessage());
      }

      // continue or exit
      this.continueSender(roomId);
    });
  }

  private continueHandler(socket: Socket, roomId: string): void {
    socket.on("continueCallBack", (data: SocketData) => {
      const answer = data.message;

      switch (answer) {
        case "y":
          // select game
          this.selectGameSender(roomId);
          break;

        case "n":
          // disconnect
          this.messageSender(roomId, "Bye");

          socket.disconnect();
          break;

        default:
          this.continueSender(roomId);
      }
    });
  }

  // server to client event handlers
  private eventSender(
    roomId: string,
    event: string,
    message: SocketData
  ): void {
    this.socketServer.to(roomId).emit(event, message);
  }

  private messageSender(roomId: string, message: string): void {
    this.eventSender(roomId, "serverMessage", { message: message });
  }

  private gameSender(roomId: string, message: string): void {
    this.eventSender(roomId, "game", { message: message });
  }

  private continueSender(roomId: string): void {
    this.eventSender(roomId, "continue", { message: "continue?[y/n]:" });
  }

  private selectGameSender(roomId: string): void {
    this.eventSender(roomId, "selectGame", {
      message:
        "enter 1) for playing guess-numbers, 2) for playing secret-number:",
    });
  }

  //   init game object
  private gameInit(gameInput: string): NumberGamesBase {
    let gameObject: NumberGamesBase;
    const gameId: number = parseInt(gameInput);
    switch (gameId) {
      case 1:
        gameObject = new GuessNumber();
        break;

      case 2:
        gameObject = new SecretNumber();
        break;
    }

    return gameObject;
  }

  private getGameMessage(message: GameMessage): string | undefined {
    if (message.isCorrect === true) {
      return;
    }

    return message.hint;
  }
}
