import {
  NumberGamesBase,
  GameMessage,
  ValidateResult,
} from "./number_games_base";

export class GuessNumber extends NumberGamesBase {
  protected readonly gameName: string = "guess-number";
  protected result: string = "";

  // determine class-only parameter
  private digitLength: number = 4;

  public gameStart(): GameMessage {
    this.result = this.generateResult();

    this.isPlaying = true;

    return {
      isCorrect: false,
      hint: "let's guess:",
    };
  }

  protected generateResult(): string {
    return NumberGamesBase.getRandomIntString(this.digitLength);
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

    // check answer length
    if (answer.length !== this.digitLength) {
      return {
        isValid: false,
        message: "invalid input",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  }

  public guess(answer: string = ""): GameMessage {
    // init
    let resultA: number = 0;
    let resultB: number = 0;
    const excludeIndex: number[] = []; //exclude index that is full match

    // validate input
    const validateResult: ValidateResult = this.validateAnswer(answer);
    if (!validateResult.isValid) {
      return {
        isCorrect: false,
        hint: `${validateResult.message}:`,
      };
    }

    // handle full match case
    answer.split("").forEach((num, index) => {
      if (this.result[index] === num) {
        resultA++;

        excludeIndex.push(index);
      }
    });

    // handle number match case
    answer.split("").forEach((num, index) => {
      let numIndex: number = this.result.indexOf(num);

      while (numIndex >= 0) {
        if (!excludeIndex.includes(numIndex)) {
          excludeIndex.push(numIndex);

          resultB++;
        }

        numIndex = this.result.indexOf(num, numIndex + 1);
      }
    });

    let isCorrect: boolean = false;
    let hint: string = "";

    // handle results
    if (resultA === this.digitLength) {
      // case win
      this.isPlaying = false;
      return {
        isCorrect: true,
      };
    } else {
      // case lose
      hint = `${answer}=>${resultA}A${resultB}B:`;
    }

    return {
      isCorrect: isCorrect,
      hint: hint,
    };
  }
}
