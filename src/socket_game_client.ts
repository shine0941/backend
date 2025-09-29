import * as readline from "readline";
import { io, Socket } from "socket.io-client";
import {
  SocketData,
  ServerToClientEvents,
  ClientToServerEvents,
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

      this.socketClient.emit("joinRoom");

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
    this.socketClient.on("serverMessage", (message: SocketData) => {
      console.log(`${message.message}`);
    });
  }

  private selectGameHandler(): void {
    this.socketClient.on("selectGame", async (message: SocketData) => {
      const game = await this.askQuestion(`${message.message}`);

      this.socketClient.emit("selectGameCallBack", { message: game });
    });
  }

  private gameHandler(): void {
    this.socketClient.on("game", async (message: SocketData) => {
      const answer = await this.askQuestion(`${message.message}`);

      this.socketClient.emit("gameCallBack", { message: answer });
    });
  }

  private continueHandler(): void {
    this.socketClient.on("continue", async (message: SocketData) => {
      const answer = await this.askQuestion(`${message.message}`);

      this.socketClient.emit("continueCallBack", { message: answer });
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
