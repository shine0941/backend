export type GameMessage = GameSuccessMessage | GameFailMessage;

// prettier-ignore
export interface GameSuccessMessage {
  isCorrect: true,
}

// prettier-ignore
export interface GameFailMessage {
  isCorrect: false,
  hint: string,
}

// prettier-ignore
export interface ValidateResult {
  isValid: boolean,
  message: string,
}

export abstract class NumberGamesBase {
  protected abstract readonly gameName: string;
  protected abstract result: unknown;
  protected isPlayingFlag: boolean = false;

  get isPlaying() {
    return this.isPlayingFlag;
  }

  set isPlaying(value: boolean) {
    this.isPlayingFlag = value;
  }

  public gameStartMessage(): string {
    return `${this.gameName} game start`;
  }

  public gameWinMessage(): string {
    return `you win, the answer is ${this.result}`;
  }

  public gameLoseMessage(): string {
    return `you lose, the answer is ${this.result}`;
  }

  // abstract functions
  public abstract gameStart(): GameMessage;

  protected abstract generateResult(): unknown;

  protected abstract validateAnswer(answer: string): ValidateResult;

  public abstract guess(answer: string): GameMessage;

  // static functions
  public static isGameObject(obj: unknown) {
    return obj instanceof NumberGamesBase;
  }

  protected static getRandomIntString(length: number = 4): string {
    let rtn: string = "";

    for (let i: number = 0; i < length; i++) {
      rtn += this.getRandomInt(10).toString();
    }

    return rtn;
  }

  protected static getRandomInt(
    max: number = 0,
    plusOne: boolean = false
  ): number {
    return Math.floor(Math.random() * max) + (plusOne ? 1 : 0);
  }
}
