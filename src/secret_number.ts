import {
  NumberGamesBase,
  GameMessage,
  ValidateResult,
} from "./number_games_base";

export class SecretNumber extends NumberGamesBase {
  protected readonly gameName: string = "secret-number";
  protected result: number = 0;

  // determine class-only parameter
  private attempts: number = 0;
  private maxAttempts: number = 5;
  private hintMax: number = 100;
  private hintMin: number = 0;

  public gameStart(): GameMessage {
    this.result = this.generateResult();

    this.isPlaying = true;

    return {
      isCorrect: false,
      hint: this.basicHint(),
    };
  }

  protected generateResult(): number {
    return NumberGamesBase.getRandonInt(this.hintMax, true);
  }

  protected validateAnswer(answer: string = ""): ValidateResult {
    const answerInt: number = Number(answer);

    // check answer include char
    if (isNaN(answerInt)) {
      return {
        isValid: false,
        message: "invalid input",
      };
    }

    // check answer is in the range
    if (answerInt >= this.hintMax || answerInt <= this.hintMin) {
      return {
        isValid: false,
        message: "out of range",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  }

  public guess(answer: string = ""): GameMessage {
    // validate input
    let validateResult: ValidateResult = this.validateAnswer(answer);
    if (!validateResult.isValid) {
      return {
        isCorrect: false,
        hint: `${validateResult.message}:`,
      };
    }

    const answerInt: number = Number(answer);
    let isCorrect: boolean = false;
    let hint: string = "";

    // increase attempts
    this.attempts++;

    // check reslt and answer
    if (answerInt === this.result) {
      // case hit
      this.isPlaying = false;

      return {
        isCorrect: true,
      };
    } else {
      // case not hit
      this.hintMax = answerInt > this.result ? answerInt : this.hintMax;
      this.hintMin = answerInt < this.result ? answerInt : this.hintMin;

      hint = this.basicHint();
    }

    // check attempts
    if (this.attempts >= this.maxAttempts) {
      this.isPlaying = false;
    }

    return {
      isCorrect: isCorrect,
      hint: hint,
    };
  }

  private basicHint(): string {
    return `between ${this.hintMin} to ${this.hintMax},(${this.maxAttempts - this.attempts
      }/${this.maxAttempts}):`;
  }
}
