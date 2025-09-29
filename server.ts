import { SocketGameServer } from "./src/socket_game_server";

function main() {
  const socketGameServer = new SocketGameServer(3000);
  socketGameServer.start();
}

main();
