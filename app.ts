import * as readline from "readline";
import { GuessNumber } from "./src/guess_number";
import { SecretNumber } from "./src/secret_number";
import { NumberGamesBase, GameMessage } from "./src/number_games_base";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const allowedGames: number[] = [1, 2];

function askQuestion(query: string = ""): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

function getGameMessage(message: GameMessage): string | undefined {
  if (message.isCorrect === true) {
    return;
  }
  return message.hint;
}

async function main() {
  // init
  let gameObject: NumberGamesBase;
  let answer: string = "";

  // asking game id
  const gameInput: string = await askQuestion(
    "enter 1) for playing guess-numbers, 2) for playing secret-number:"
  );
  const game: number = parseInt(gameInput);

  // handle invalid input
  if (isNaN(game) || !allowedGames.includes(game)) {
    console.log("invalid game input");

    rl.close();
    return;
  }

  // assign game object
  switch (game) {
    case 1:
      gameObject = new GuessNumber();
      break;

    case 2:
      gameObject = new SecretNumber();
      break;

    default:
      console.log("handle default case");
      rl.close();
      return;
  }

  let gameMessage: GameMessage;

  // game start
  gameMessage = gameObject.gameStart();
  console.log(gameObject.gameStartMessage());

  // playing
  while (gameObject.isPlaying) {
    // wait answer
    answer = await askQuestion(getGameMessage(gameMessage));

    gameMessage = gameObject.guess(answer);
  }

  // handle game result
  if (gameMessage.isCorrect === true) {
    console.log(gameObject.gameWinMessage());
  } else {
    console.log(gameObject.gameLoseMessage());
  }

  // end
  rl.close();

  return;
}

main();
