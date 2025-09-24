import { NumberGamesBase } from './number_games_base';

export class SecretNumber extends NumberGamesBase<number> {
  // private result: number;
  private maxAttempts: number;
  private attempts: number = 0;
  private hintMax: number;
  private hintMin: number;

  public constructor(
    maxAttempts: number = 5,
    hintMax: number = 100,
    hintMin: number = 0
  ) {
    super();

    this.maxAttempts = maxAttempts;
    this.hintMax = hintMax;
    this.hintMin = hintMin;

    // game start
    // this.result = this.getRandomInt(this.hintMax, true);
    // this.generateResult();
    // this.isPlaying = true;

    // game start message
    console.log('secret-number game start');
    this.hint = `between ${this.hintMin} to ${this.hintMax},(${
      this.maxAttempts - this.attempts
    }/${this.maxAttempts})`;
  }

  protected generateResult(): void {
    this.result = this.getRandomInt(this.hintMax, true);
  }

  protected validateAnswer(answer: string): boolean {
    const answerInt = Number(answer);

    // check answer include char
    if (isNaN(answerInt)) {
      this.hint = 'invalid input';
      return false;
    }

    // check answer is in the range
    if (answerInt >= this.hintMax || answerInt <= this.hintMin) {
      this.hint = 'out of range';
      return false;
    }

    return true;
  }

  public guess(answer: string): void {
    // validate input
    if (!this.validateAnswer(answer)) {
      return;
    }

    const answerInt = Number(answer);

    // increase attempts
    this.attempts++;

    // check reslt and answer
    if (answerInt === this.result) {
      // case hit
      this.isPlaying = false;

      console.log(`you win, the answer is ${this.result}`);

      return;
    } else {
      // case not hit
      this.hintMax = answerInt > this.result ? answerInt : this.hintMax;
      this.hintMin = answerInt < this.result ? answerInt : this.hintMin;

      this.hint = `between ${this.hintMin} to ${this.hintMax},(${
        this.maxAttempts - this.attempts
      }/${this.maxAttempts})`;
    }

    // check attempts
    if (this.attempts >= this.maxAttempts) {
      this.isPlaying = false;

      console.log(`you lose, the answer is ${this.result}`);
    }

    return;
  }
}
