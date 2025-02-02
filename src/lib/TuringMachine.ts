import { Doc } from "../../convex/_generated/dataModel";
import { challengeNameToIndex, generateChallenge } from "./Challenges";

export type State = number;

export enum Direction {
  Left = 'left',
  Right = 'right'
}

export interface Rule {
  state: State;
  read: string;
  newState: State;
  write: string;
  direction: Direction;
}

export function mapRule(rule: Doc<"rules">["rule"]): Rule {
  return {
    state: rule.state,
    read: rule.read,
    newState: rule.newState,
    write: rule.write,
    direction: rule.direction === "left" ? Direction.Left : Direction.Right,
  };
}

export type Tape = string[];

export const BLANK = '_';
export const END_STATE = -1;

export class TuringMachine {
  private bounded: boolean;
  private tape: Tape;
  private index: number;
  private state: State;
  private rules: Rule[];

  public statesUsed = new Set<number>();
  public rulesUsed = new Set<Rule>();
  public charsSeen = new Set<string>();

  constructor(
    rules: Rule[],
    initialTape: Tape,
    tapeIndex: number,
    initialState: State,
  ) {
    this.rules = rules;
    this.state = initialState;
    this.tape = initialTape;
    this.index = tapeIndex;
    this.bounded = true;
  }

  private left(): void {
    if (this.index === 0 && !this.bounded) {
      this.tape = [BLANK, ...this.tape];
      this.index += 1;
    }
    this.index -= 1;
  }

  private right(): void {
    if (this.index === this.tape.length - 1 && !this.bounded) {
      this.tape = [...this.tape, BLANK];
    }
    this.index += 1;
  }

  private read(): string {
    return this.tape[this.index];
  }

  private write(c: string): void {
    this.tape[this.index] = c;
  }

  private runRule(rule: Rule): void {
    this.statesUsed.add(rule.newState);
    this.rulesUsed.add(rule);
    this.charsSeen.add(rule.write);

    this.state = rule.newState;
    this.write(rule.write);
    if (rule.direction === Direction.Right) {
      this.right();
    } else {
      this.left();
    }
  }

  private ruleToUse(): Rule | undefined {
    const read = this.read();

    this.statesUsed.add(this.state);
    this.charsSeen.add(read);

    return this.rules.find(rule => rule.read === read && rule.state === this.state);
  }

  public step(): Rule | undefined {
    if (this.index < 0 || this.index >= this.tape.length) {
      return undefined;
    }
    const rule = this.ruleToUse();
    if (rule) {
      this.runRule(rule);
      return rule;
    }
    return undefined;
  }

  public solve(goalTape: Tape, finalStateMustBe?: number): boolean {
    let iterations = 0;
    while (iterations < 1000) {
      if (finalStateMustBe !== undefined) {
        if (this.isEqual(this.tape, goalTape) && this.state === finalStateMustBe) {
          return true;
        }
      } else if (this.isEqual(this.tape, goalTape)) {
        return true;
      }
      if (this.index < 0 || this.index >= this.tape.length) {
        return false;
      }
      const ruleUsed = this.step();
      if (!ruleUsed) {
        return false;
      }
      iterations += 1;
    }
    return false;
  }

  private isEqual(tape1: Tape, tape2: Tape): boolean {
    if (tape1.length !== tape2.length) return false;
    return tape1.every((char, i) => char === tape2[i]);
  }

  // Getters for current state
  public getCurrentState(): State {
    return this.state;
  }

  public getCurrentTape(): Tape {
    return [...this.tape];
  }

  public getCurrentIndex(): number {
    return this.index;
  }
}

export function calculateAccuracy(rules: Rule[], challengeIndex: number): boolean {
  for (let i = 0; i < 100; i++) {
    const challenge = generateChallenge(challengeIndex);
    const initialTape = challenge.startTape.slice();
    const goalTape = challenge.goalTape.slice();
    const finalStateMustBe = challenge.requiresEndState ? challenge.maxState + 1 : undefined;
    const machine = new TuringMachine(rules, initialTape, challenge.startIndex, challenge.startState);
    const solved = machine.solve(goalTape, finalStateMustBe);
    if (!solved) {
      console.log('Failed to solve', challenge.startTape.slice(), challenge.goalTape.slice(), machine.getCurrentTape());
      return false;
    }
  }
  return true;
}

export function calculateAccuracyForChallenge(rules: Rule[], challengeName: string): boolean {
  const challengeIndex = challengeNameToIndex(challengeName);
  return calculateAccuracy(rules, challengeIndex);
}
