import { NumberGamesBase } from './number_games_base';
export class GuessNumber extends NumberGamesBase<string> {
  // private result: string;
  private digitLength: number;

  public constructor(digitLength: number = 4) {
    super();

    this.digitLength = digitLength;

    // game start
    // this.result = this.getRandomIntString(this.digitLength);
    // this.generateResult();
    // this.isPlaying = true;

    // game start message
    this.hint = 'guess-number game start';
  }

  protected generateResult(): void {
    console.log('B');
    this.result = this.getRandomIntString(this.digitLength);
    console.log(this.result);
  }

  protected validateAnswer(answer: string): boolean {
    const answerInt = Number(answer);

    // check answer include char
    if (isNaN(answerInt)) {
      this.hint = 'invalid input';
      return false;
    }

    // check answer length
    if (answer.length !== this.digitLength) {
      this.hint = 'invalid input';
      return false;
    }

    return true;
  }

  public guess(answer: string): void {
    // init
    let resultA = 0;
    let resultB = 0;
    let excludeIndex: number[] = []; //exclude index that is full match

    // validate input
    if (!this.validateAnswer(answer)) {
      return;
    }

    // handle full match case
    answer.split('').forEach((num, index) => {
      if (this.result[index] === num) {
        resultA++;

        excludeIndex.push(index);
      }
    });

    // handle number match case
    answer.split('').forEach((num, index) => {
      let numIndex = this.result.indexOf(num);

      while (numIndex >= 0) {
        if (!excludeIndex.includes(numIndex)) {
          excludeIndex.push(numIndex);
          resultB++;
        }

        numIndex = this.result.indexOf(num, numIndex + 1);
      }
    });

    // handle results
    if (resultA === this.digitLength) {
      // case win
      console.log(`you win, the answer is ${this.result}`);
      this.isPlaying = false;
    } else {
      // case lose
      this.hint = `${answer}=>${resultA}A${resultB}B`;
    }

    return;
  }
}
