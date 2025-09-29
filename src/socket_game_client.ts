import * as readline from "readline";
import { io, Socket } from "socket.io-client";
import {
  SocketData,
  ServerToClientEvents,
  ServerEvents,
  ClientToServerEvents,
  ClientEvents,
} from "./utils/socket_common";

export class SocketGameClient {
  private socketClient: Socket<ServerToClientEvents, ClientToServerEvents>;
  private rl: readline.Interface;
  private serverUrl: string;

  constructor(serverUrl: string = "http://localhost:3000") {
    this.serverUrl = serverUrl;

    this.setupSocketClientHandlers();
  }

  public connect(): void {
    this.socketClient.connect();
  }

  private async setupSocketClientHandlers(): Promise<void> {
    this.socketClient = io(this.serverUrl, {
      autoConnect: false,
    });

    this.socketClient.on("connect", () => {
      console.log("Welcom!");

      this.socketClient.emit("client:joinRoom");

      this.initReadline();
    });

    this.socketClient.on("disconnect", (reason: string) => {
      console.log(`reason:${reason}`);

      this.rl.close();
      return;
    });

    // server message handler
    this.messageHandler();

    // select game handler
    this.selectGameHandler();

    // game playing handler
    this.gameHandler();

    // continue handler
    this.continueHandler();
  }

  //   event handlers
  private messageHandler(): void {
    this.socketClient.on("server:message", (message: SocketData) => {
      console.log(`${message.message}`);
    });
  }

  private async callbackHandler(
    emitEvent: ClientEvents,
    message: SocketData
  ): Promise<void> {
    const answer = await this.askQuestion(`${message.message}`);

    this.socketClient.emit(emitEvent, { message: answer });
  }

  private selectGameHandler(): void {
    this.socketClient.on("server:selectGame", async (message: SocketData) => {
      this.callbackHandler("client:selectGameCallBack", message);
    });
  }

  private gameHandler(): void {
    this.socketClient.on("server:game", async (message: SocketData) => {
      this.callbackHandler("client:gameCallBack", message);
    });
  }

  private continueHandler(): void {
    this.socketClient.on("server:continue", async (message: SocketData) => {
      this.callbackHandler("client:continueCallBack", message);
    });
  }

  private askQuestion(query: string = ""): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, (answer: string) => {
        resolve(answer);
      });
    });
  }

  private initReadline(): void {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
}
