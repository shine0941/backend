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
  private static allowedGames: number[] = [1, 2];
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

  public static getRandomIntString(length: number = 4): string {
    let rtn: string = "";

    for (let i: number = 0; i < length; i++) {
      rtn += this.getRandonInt(10).toString();
    }

    return rtn;
  }

  protected static getRandonInt(max: number = 0, plusOne: boolean = false) {
    return Math.floor(Math.random() * max) + (plusOne ? 1 : 0);
  }

  public static isValidGameId(gameInput): boolean {
    const gameId: number = parseInt(gameInput);

    if (isNaN(gameId) || !this.allowedGames.includes(gameId)) {
      console.log("invalid game input");

      return false;
    }
    return true;
  }
}
