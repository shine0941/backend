import { SocketGameClient } from "./src/socket_game_client";

function main() {
  const socketGameClient = new SocketGameClient("http://localhost:3000");
  socketGameClient.connect();
}

main();
