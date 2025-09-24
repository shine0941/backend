export abstract class NumberGamesBase<T> {
  protected result!: T;

  public constructor(
    protected _isPlaying: boolean = false,
    protected _hint: string = ''
  ) {
    this.generateResult();
    this.isPlaying = true;
  }

  get hint() {
    return this._hint;
  }

  set hint(value: string) {
    this._hint = value;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set isPlaying(value: boolean) {
    this._isPlaying = value;
  }

  protected abstract generateResult(): void;

  protected abstract validateAnswer(answer: string): boolean;

  public abstract guess(answer: string): void;

  public generateHint(): string {
    // console.log(`NumberGamesBase generateHint:${this.hint}`);

    return `${this.hint}:`;
  }

  // static functions
  static isGameObject(obj) {
    return obj instanceof NumberGamesBase;
  }

  // common functions
  protected getRandomIntString(length: number = 4): string {
    let rtn: string = '';

    for (let i = 0; i < length; i++) {
      rtn += this.getRandomInt(10).toString();
    }

    return rtn;
  }

  protected getRandomInt(max: number, plusOne: boolean = false) {
    return Math.floor(Math.random() * max) + (plusOne ? 1 : 0);
  }
}
