export type Tape = string[];
export const BLANK = '_';
export const MAX_CHALLENGE_INDEX = 24;

// inclusive
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function createArrayWithGenerator<T>(count: number, generator: () => T): T[] {
  return Array.from({ length: count }, generator);
}

export function createArrayFromArray<T>(count: number, sourceArray: T[]): T[] {
  return createArrayWithGenerator(count, () => getRandomFromArray(sourceArray));
}

export function createBlanks(count: number): Tape {
  return Array(count).fill(BLANK);
}

export function makeTape(...tapes: Tape[]): Tape {
  return tapes.reduce((acc, tape) => [...acc, ...tape], []);
}

export function getState(customStates: string[] | undefined, stateIndex: number): string {
  return customStates ? customStates[stateIndex] : `q${stateIndex}`;
}

export function intToBinary(num: number): Tape {
  if (num === 0) return ['0'];
  const binary: string[] = [];
  let n = num;
  while (n > 0) {
    binary.unshift(n % 2 === 0 ? '0' : '1');
    n = Math.floor(n / 2);
  }
  return binary;
}

export function binaryToInt(binary: string[]): number {
  return binary.reduce((acc, digit) => acc * 2 + (digit === '0' ? 0 : 1), 0);
}

export interface Challenge {
  name: string;
  startTape: Tape;
  goalTape: Tape;
  startIndex: number;
  startState: number;
  maxState: number;
  allowedCharacters: string[];
  hints: string[];
  requiresEndState: boolean;
  customStates?: string[];
  tutorialTip?: string;
}

export function generateChallenge(index: number): Challenge {
  switch (index) {
    case 0: // Getting Started
    {
      return {
        name: "Getting Started",
        startTape: [BLANK],
        goalTape: ['1'],
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: [BLANK, '1'],
        hints: ['Rule you need: read "_"→ write "1"'],
        requiresEndState: false,
        tutorialTip: 'Click "Add Rule" and create a rule that reads _ and writes 1',
      };
    }

    case 1: // Go Right
    {
      return {
        name: "Go Right",
        startTape: [BLANK, BLANK],
        goalTape: ['1', '1'],
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: [BLANK, '1'],
        hints: ['Rule: Read "_", write "1", move Right'],
        requiresEndState: false,
        tutorialTip: 'Add a rule that reads "_", writes "1", and moves right ➡︎',
      };
    }

    case 2: // Deletion
      return {
        name: "Deletion",
        startTape: ['🥝', '🥝', '🥝', '🥝'],
        goalTape: ['🥥', '🥥', '🥥', '🥥'],
        startIndex: 3,
        startState: 0,
        maxState: 0,
        allowedCharacters: ['🥝', '🥥'],
        hints: ['Rule: Read "🥝", write "🥥", and move Left'],
        requiresEndState: false,
        tutorialTip: 'Characters can be anything, even emojis! Add a rule that reads "🥝", writes "🥥", and moves left ⬅︎',
      };

    case 3:
      return {
        name: "All On",
        startTape: ['😴', '😎', '😴', '😴', '😎', '😴', '😎'],
        goalTape: ['😎', '😎', '😎', '😎', '😎', '😎', '😎'],
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: ['😴', '😎'],
        hints: ["Two rules: 😴→😎 and 😎→😎"],
        requiresEndState: false,
        tutorialTip: 'Now you need two rules',
      };

    case 4: // Alternator
    {
      const sequence = ['0', '1', '0', '1', '0', '1', '0'];
      return {
        name: "Alternator",
        startTape: createBlanks(sequence.length),
        goalTape: sequence,
        startIndex: sequence.length - 1,
        startState: 0,
        maxState: 1,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "q0 means write \"0\", q1 means write \"1\""
        ],
        requiresEndState: false,
        tutorialTip: "Your machine now has two states: q0 and q1. When in q0, write 0 and switch to q1. When in q1, write 1 and switch to q0.",
      };
    }

    case 5: // Sequencer
    {
      return {
        name: "Sequencer",
        startTape: createBlanks(9),
        goalTape: ['0', BLANK, '1', BLANK, '0', BLANK, '1', BLANK, '0'],
        startIndex: 0,
        startState: 0,
        maxState: 3,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Try writing one rule at a time",
          "Play the machine to see what happens",
          "Loop through your four states"
        ],
        requiresEndState: false,
      };
    }

    case 6: // Bit flipper
    {
      const flipperBits = createArrayFromArray(getRandomInt(5, 12), ['0', '1']);
      const flipped = flipperBits.map(c => c === '0' ? '1' : '0');
      return {
        name: "Bit flipper",
        startTape: flipperBits,
        goalTape: flipped,
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: ['0', '1'],
        hints: [
          "Ones become zeros",
          "Zeros become ones"
        ],
        requiresEndState: false,
        customStates: ['🩴'],
        tutorialTip: "States can be any character, even emojis!",
      };
    }

    case 7: // There and back
    {
      return {
        name: "There and back",
        startTape: [BLANK, '1', '1', '1', '1', '1', BLANK],
        goalTape: [BLANK, '0', '0', '0', '0', '0', BLANK],
        startIndex: 3,
        startState: 0,
        maxState: 0,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "You only have one state",
          "Ones and zeros become zeros",
          "Blanks remain blank",
          "Experiment with directions"
        ],
        requiresEndState: false,
        tutorialTip: "This is the first 'challenging' challenge. With only one state, write rules that zero out the whole tape.",
      };
    }

    case 8: // Carry the one
    {
      return {
        name: "Carry the one",
        startTape: ["1", "0", "0", "0", "0", "0", "1"],
        goalTape: [BLANK, BLANK, BLANK, BLANK, BLANK, "1", "1"],
        startIndex: 0,
        startState: 0,
        maxState: 1,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          'Read 1 in state q0, write _ and set to state q1',
        ],
        requiresEndState: true,
        tutorialTip: 'Use your two states to move the 1 to the right. You should end in the terminal state q2.',
      };
    }

    case 9: // Binary Add 1
    {
      const number = (getRandomInt(0, 59) + 1) * 2 - 1;
      const numberBits = intToBinary(number);
      const subBits = intToBinary(number + 1);
      while (subBits.length < numberBits.length) {
        subBits.unshift('0');
      }
      while (subBits.length > numberBits.length) {
        numberBits.unshift('0');
      }
      return {
        name: "Binary Add 1",
        startTape: makeTape(numberBits, [BLANK]),
        goalTape: makeTape(subBits, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 1,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Base two addition",
          "Got to the right of the digits",
          "0→1, 1→0"
        ],
        requiresEndState: true,
        tutorialTip: `This is the first "useful" challenge. Increment the binary representation of ${number} by 1 to get the binary representation of ${number + 1}.`,
      };
    }

    case 10: // Compression
    {
      let toCondense = ["1"];
      let compressed = ["1"];
      while (compressed.length === 0 || compressed.length === toCondense.length) {
        toCondense = createArrayFromArray(getRandomInt(0, 4) + 4, ['1', '0']);
        compressed = toCondense.filter(c => c === '1');
      }
      return {
        name: "Compression",
        startTape: makeTape([BLANK], toCondense, [BLANK]),
        goalTape: makeTape([BLANK], createBlanks(toCondense.length - compressed.length), compressed, [BLANK]),
        startIndex: 1,
        startState: 0,
        maxState: 2,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "If a pair is out of order, perform swaps of adjacents",
        ],
        requiresEndState: true,
        tutorialTip: 'Compress the tape by removing 0s. Make sure to handle all cases (click Reload to generate more cases).'
      }
    }

    case 11: // Duplicator
    {
    /*
    let toDup = Array(repeating: Character("1"), count: Int(arc4random())%10 + 1)
            let placeToPutDup = Array(repeating: b, count: toDup.count)
            self.init(startTape: makeTape([toDup,bt,placeToPutDup]), goalTape: makeTape([toDup,bt,toDup]), startIndex: 0, startState: 0, allowedCharacters: [b, "1"], maxState: 4, name: "Duplicator")
            addHints("This example is on Wikipedia", "Move over one at a time", "Use blanks as placeholders")
            requiresEndState = true*/
      const toDup = createArrayFromArray(getRandomInt(0, 9) + 1, ['1']);
      const placeToPutDup = createArrayFromArray(toDup.length, [BLANK]);
      return {
        name: "Duplicator",
        startTape: makeTape(toDup, [BLANK], placeToPutDup),
        goalTape: makeTape(toDup, [BLANK], toDup),
        startIndex: 0,
        startState: 0,
        maxState: 4,
        allowedCharacters: [BLANK, '1'],
        hints: [
          "This example is on Wikipedia",
          "Move over one at a time",
          "Use blanks as placeholders"
        ],
        requiresEndState: true
      };
    }

    case 12: // Sort
    {
      let toSort: Tape = [];
      let sorted: Tape = [];
      while (JSON.stringify(toSort) === JSON.stringify(sorted)) {
        toSort = createArrayFromArray(getRandomInt(0, 9) + 5, ['0', '1', '2']);
        sorted = [...toSort].sort();
      }
      return {
        name: "Sort",
        startTape: makeTape([BLANK], toSort, [BLANK]),
        goalTape: makeTape([BLANK], sorted, [BLANK]),
        startIndex: 1,
        startState: 0,
        maxState: 4,
        allowedCharacters: [BLANK, '0', '1', '2'],
        hints: [
          "If a pair is out of order,",
          "Perform swaps of adjacents",
          "This is Insertion Sort",
        ],
        requiresEndState: true
      };
    }

    case 13:
    {
      const ones = createArrayFromArray(getRandomInt(0, 17) + 2, ['1']);
      const modThree = '' + (ones.length % 3);
      return {
        name: "Modulo 3",
        startTape: makeTape([BLANK], [BLANK], ones),
        goalTape: makeTape([modThree], [BLANK], createBlanks(ones.length)),
        startIndex: ones.length + 1,
        startState: 0,
        maxState: 4,
        allowedCharacters: [BLANK, '0', '1', '2'],
        hints: [
          "Carry each one over",
          "Increase left digit by one mod 3",
          "0→1, 1→2, 2→0"
        ],
        requiresEndState: true
      };
    }

    case 14: // Binary Counter
    {
    /*
    let ones = Array<Character>(repeating: "1", count: Int(arc4random())%18+2)
            let countBits = intToBinary(ones.count)
            self.init(startTape: makeTape(bs(countBits), bt, ones), goalTape: makeTape(countBits, bt, ones), startIndex: ones.count+countBits.count, startState: 0, allowedCharacters: [b,"0","1"], maxState: 4, name: "Binary Counter")
            addHints("Carry ones over like in Duplicator", "Use binary to add to total count", "It's like regular numbers but 1+1=10")
            requiresEndState = true */
      const ones = createArrayFromArray(getRandomInt(0, 17) + 2, ['1']);
      const countBits = intToBinary(ones.length);
      return {
        name: "Binary Counter",
        startTape: makeTape(createBlanks(countBits.length), [BLANK], ones),
        goalTape: makeTape(countBits, [BLANK], ones),
        startIndex: ones.length + countBits.length,
        startState: 0,
        maxState: 4,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Carry ones over like in Duplicator",
          "Use binary to add to total count",
          "It's like regular numbers but 1+1=10"
        ],
        requiresEndState: true
      };
    }

    case 15: // Inverse Counter
     /*let ones = Array<Character>(repeating: "1", count: Int(arc4random())%18+2)
            let countBits = intToBinary(ones.count)
            self.init(startTape: makeTape(bt, countBits, bt,Array<Character>(repeating: b, count: ones.count)), goalTape: makeTape(bt, Array<Character>(repeating: b, count: countBits.count), bt, ones), startIndex: countBits.count, startState: 0, allowedCharacters: [b,"0","1"], maxState: 4, name: "Inverse Counter")
            addHints("Subtract one using binary subtraction", "Transfer this one to the right")
            requiresEndState = true*/
    {
      const ones = createArrayFromArray(getRandomInt(0, 17) + 2, ['1']);
      const countBits = intToBinary(ones.length);
      return {
        name: "Inverse Counter",
        startTape: makeTape([BLANK], countBits, [BLANK], createBlanks(ones.length)),
        goalTape: makeTape(createBlanks(countBits.length), [BLANK], ones),
        startIndex: countBits.length,
        startState: 0,
        maxState: 4,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Subtract one using binary subtraction",
          "Transfer this one to the right"
        ],
        requiresEndState: true
      };
    }

    case 16: // Bit shifter
   {
    const bits = createArrayFromArray(8, ['0', '1']);
    const integer = binaryToInt(bits);
    const bitShift = getRandomInt(0, 3) + 1;
    const bitShiftBits = intToBinary(bitShift);
    const bitShiftedBits = intToBinary(integer >> bitShift);
    const padded = makeTape(createArrayFromArray(8 - bitShiftedBits.length, ['0']), bitShiftedBits);
    const rightPadding = createArrayFromArray(3 + bitShiftBits.length, [BLANK]);
    const start = makeTape([BLANK], bits, ['>', '>'], bitShiftBits, [BLANK]);
    const end = makeTape([BLANK], padded, rightPadding);
    return {
      name: "Bit shifter",
      startTape: start,
      goalTape: end,
      startIndex: 10 + bitShiftBits.length,
      startState: 0,
      maxState: 5,
      allowedCharacters: [BLANK, '0', '1', '>'],
      hints: [
        "Subtract one from the right side",
        "Shift digits to the right"
      ],
      requiresEndState: true
    };
   }

    case 17: // Copier
    {
      const toDuplicate = createArrayFromArray(6, ['0', '1']);
      const blanks = createBlanks(toDuplicate.length);
      const firstPart = makeTape([BLANK], toDuplicate, [BLANK]);
      const duplicateStart = makeTape(firstPart, blanks, [BLANK]);
      const duplicateGoal = makeTape(firstPart, toDuplicate, [BLANK]);
      return {
        name: "Copier",
        startTape: duplicateStart,
        goalTape: duplicateGoal,
        startIndex: 1,
        startState: 0,
        maxState: 4,
        allowedCharacters: [BLANK, '0', '1', 'x', 'a', 'b'],
        hints: [
          "You have three spare characters",
          "Use x to separate original from copy",
          "Replace 0 with a, 1 with b"
        ],
        requiresEndState: true
      };
    }

    case 18: // Palindrome
    {
      let randomBinary: string[];
      do {
        randomBinary = createArrayFromArray(5, ['0', '1']);
      } while (!randomBinary.includes('1') || !randomBinary.includes('0'));
      const flipped = [...randomBinary].reverse();
      
      return {
        name: "Palindrome",
        startTape: makeTape(randomBinary, createBlanks(randomBinary.length)),
        goalTape: makeTape(randomBinary, flipped),
        startIndex: 0,
        startState: 0,
        maxState: 3,
        allowedCharacters: [BLANK, '0', '1', 'a'],
        hints: ["Replace 0→a, 1→b", "Then move out from center"],
        requiresEndState: false
      };
    }

    case 19: // XOR
    {
      const xorLen = Math.random() < 0.5 ? 6 : 4;
      const xorFirstBits = createArrayFromArray(xorLen, ['0', '1']);
      const xorNextBits = createArrayFromArray(xorLen, ['0', '1']);
      const xored = xorFirstBits.map((bit, i) => bit === xorNextBits[i] ? '0' : '1');
      const xorBlanks = createBlanks(xorLen);
      
      return {
        name: "XOR",
        startTape: makeTape(xorFirstBits, ['^'], xorNextBits, ['='], xorBlanks),
        goalTape: makeTape(xorBlanks, [BLANK], xorBlanks, [BLANK], xored),
        startIndex: 0,
        startState: 0,
        maxState: 5,
        allowedCharacters: [BLANK, '0', '1', '^', '='],
        hints: [
          "The title \"XOR\" means exclusive or",
          "XOR the first digits of each number",
          `Replace in left number with ${BLANK}`,
          "Replace in right number with ^"
        ],
        requiresEndState: true
      };
    }

    case 20: // Mode
    {
      const oddNumber = 2 * (getRandomInt(0, 4) + 2) + 1;
      let bits: string[];
      let countOnes: number;
      do {
        bits = createArrayFromArray(oddNumber, ['0', '1']);
        countOnes = bits.filter(b => b === '1').length;
      } while (countOnes === 0);
      
      const mode = countOnes * 2 > oddNumber ? '1' : '0';
      const halfBlanks = createBlanks(Math.floor(bits.length / 2));
      
      return {
        name: "Mode",
        startTape: makeTape([BLANK], bits, [BLANK]),
        goalTape: makeTape([BLANK], halfBlanks, [mode], halfBlanks, [BLANK]),
        startIndex: 1,
        startState: 0,
        maxState: 8,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "The title \"Mode\" is a statistics term",
          "You have an odd set of 0's and 1's",
          "Therefore, Mode = Median",
          "First sort, then remove extremes"
        ],
        requiresEndState: true
      };
    }

    case 21: // Addition
    {
      const addFirst = getRandomInt(2, 41);
      const addSecond = getRandomInt(2, 41);
      const addFirstBits = intToBinary(addFirst);
      const addSecondBits = intToBinary(addSecond);
      const sumBits = intToBinary(addFirst + addSecond);
      const totalLength = addFirstBits.length + sumBits.length + 3;
      const neededExtra = createBlanks(totalLength - addFirstBits.length - addSecondBits.length - 3);
      const finalPad = createBlanks(totalLength - sumBits.length - 1);
      
      return {
        name: "Addition",
        startTape: makeTape([BLANK], addFirstBits, [BLANK], neededExtra, addSecondBits, [BLANK]),
        goalTape: makeTape(finalPad, sumBits, [BLANK]),
        startIndex: addFirstBits.length,
        startState: 0,
        maxState: 6,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Subtract one from the left number",
          "Add that one to the right number",
          "There are two methods to subtract"
        ],
        requiresEndState: false
      };
    }

    case 22: // Greater than or equal
    {
      const firstNum = getRandomInt(2, 41);
      const secondNum = getRandomInt(2, 41);
      const firstNumBits = intToBinary(firstNum);
      const secondNumBits = intToBinary(secondNum);
      const ge = firstNum >= secondNum ? '1' : '0';
      
      return {
        name: "Greater than or equal",
        startTape: makeTape([BLANK], firstNumBits, ['≥'], secondNumBits, [BLANK]),
        goalTape: makeTape(createBlanks(firstNumBits.length + 1), [ge], createBlanks(secondNumBits.length + 1)),
        startIndex: firstNumBits.length + 1,
        startState: 0,
        maxState: 6,
        allowedCharacters: [BLANK, '0', '1', '≥'],
        hints: [],
        requiresEndState: true
      };
    }

    case 23: // Bisect
    {
      const spacing = getRandomInt(2, 9);
      return {
        name: "Bisect",
        startTape: makeTape(['1'], createBlanks(spacing), [BLANK], createBlanks(spacing), ['1']),
        goalTape: makeTape(['1'], createBlanks(spacing), ['1'], createBlanks(spacing), ['1']),
        startIndex: 0,
        startState: 0,
        maxState: 3,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Fill with zeroes, then remove edges",
          "If you run out of states, re-use",
          "Try working out rules on paper"
        ],
        requiresEndState: true
      };
    }

    case 24: // Trisect
    {
      const trisectSpacing = getRandomInt(2, 8);
      const trisectBlanks = createBlanks(trisectSpacing);
      return {
        name: "Trisect",
        startTape: makeTape(['1'], trisectBlanks, [BLANK], trisectBlanks, [BLANK], trisectBlanks, ['1']),
        goalTape: makeTape(['1'], trisectBlanks, ['1'], trisectBlanks, ['1'], trisectBlanks, ['1']),
        startIndex: 0,
        startState: 0,
        maxState: 8,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Find one third first:",
          "Remove twice as fast from one side",
          "Then bisect that third and the end"
        ],
        requiresEndState: true
      };
    }

    default:
      throw new Error(`Challenge ${index} not found`);
  }
} 

export function challengeNameToIndex(name: string): number {
  const MAX_CHALLENGE_INDEX = 24;

  for (let i = 0; i <= MAX_CHALLENGE_INDEX; i++) {
    if (generateChallenge(i).name === name) {
      return i;
    }
  }
  throw new Error(`Challenge ${name} not found`);
}
