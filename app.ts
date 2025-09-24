import * as readline from 'readline';
import { GuessNumber } from './src/guess_number.js';
import { SecretNumber } from './src/secret_number.js';
import { NumberGamesBase } from './src/number_games_base.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const allowed_games: number[] = [1, 2];

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  // init
  let gameObject: NumberGamesBase<unknown>;
  let answer: string = '';

  // asking game id
  const gameInput = await askQuestion(
    'enter 1) for playing guess-numbers, 2) for playing secret-number:'
  );
  const game = parseInt(gameInput);

  // handle invalid input
  if (isNaN(game) || !allowed_games.includes(game)) {
    console.log('invalid game input');

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
      console.log('handle default case');
      rl.close();
      return;
  }

  if (NumberGamesBase.isGameObject(gameObject)) {
    // handle game action
    while (gameObject.isPlaying) {
      // wait answer
      answer = await askQuestion(gameObject.generateHint());

      gameObject.guess(answer);
    }
  }

  // game end
  rl.close();

  return;
}

main();
