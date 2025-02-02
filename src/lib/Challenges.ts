export type Tape = string[];
export const BLANK = '_';
export const MAX_CHALLENGE_INDEX = 24;

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
}

export function generateChallenge(index: number): Challenge {
  switch (index) {
    case 0: // Getting Started
      return {
        name: "Getting Started",
        startTape: [BLANK],
        goalTape: ['1'],
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: [BLANK, '1'],
        hints: ['Rule you need: read "_"→ write "1"'],
        requiresEndState: false
      };

    case 1: // Go Right
      return {
        name: "Go Right",
        startTape: [BLANK, BLANK],
        goalTape: ['1', '1'],
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: [BLANK, '1'],
        hints: ['Rule: Read "-", write "1", move Right'],
        requiresEndState: false
      };

    case 2: // Deletion
      return {
        name: "Deletion",
        startTape: ['1', '1', '1', '1'],
        goalTape: [BLANK, BLANK, BLANK, BLANK],
        startIndex: 3,
        startState: 0,
        maxState: 0,
        allowedCharacters: [BLANK, '1'],
        hints: ['Rule: Read "1", write "_", and move Left'],
        requiresEndState: false
      };

    case 3:
      return {
        name: "All On",
        startTape: ['0', '1', '0', '0', '1', '0', '1'],
        goalTape: ['1', '1', '1', '1', '1', '1', '1'],
        startIndex: 0,
        startState: 0,
        maxState: 0,
        allowedCharacters: ['0', '1'],
        hints: ["Two rules: 0→1 and 1→1"],
        requiresEndState: false
      };

    case 4: // Alternator
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
          "Now you need two states",
          "Alternate between states q0 and q1",
          "q0 means write \"0\", q1 means write \"1\""
        ],
        requiresEndState: false
      };

    case 5: // Sequencer
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
        requiresEndState: false
      };

    case 6: // Bit flipper
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
        requiresEndState: false
      };

    case 7: // There and back
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
        requiresEndState: false
      };

    case 8: // Increment
      const toIncrement = createArrayFromArray(5, ['0', '1']);
      const incremented = intToBinary(binaryToInt(toIncrement) + 1);
      const padLength = Math.max(toIncrement.length, incremented.length);
      return {
        name: "Increment",
        startTape: makeTape([BLANK], toIncrement.length < padLength ? [...createBlanks(padLength - toIncrement.length), ...toIncrement] : toIncrement, [BLANK]),
        goalTape: makeTape([BLANK], incremented.length < padLength ? [...createBlanks(padLength - incremented.length), ...incremented] : incremented, [BLANK]),
        startIndex: padLength,
        startState: 0,
        maxState: 2,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Start from the right",
          "Carry the one"
        ],
        requiresEndState: false
      };

    case 9: // Decrement
      const toDecrement = intToBinary(getRandomInt(2, 31));
      const decremented = intToBinary(binaryToInt(toDecrement) - 1);
      return {
        name: "Decrement",
        startTape: makeTape([BLANK], toDecrement, [BLANK]),
        goalTape: makeTape([BLANK], decremented, [BLANK]),
        startIndex: toDecrement.length,
        startState: 0,
        maxState: 2,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Start from the right",
          "Borrow from the left"
        ],
        requiresEndState: false
      };

    case 10: // Zero
      const toZero = createArrayFromArray(getRandomInt(3, 8), ['0', '1']);
      return {
        name: "Zero",
        startTape: makeTape([BLANK], toZero, [BLANK]),
        goalTape: makeTape([BLANK], createBlanks(toZero.length), [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 1,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Two states: searching and zeroing",
          "First find a one",
          "Then zero everything"
        ],
        requiresEndState: true
      };

    case 11: // One counter
      const countOnesInput = createArrayFromArray(getRandomInt(3, 8), ['0', '1']);
      const numOnes = countOnesInput.filter(b => b === '1').length;
      const countResult = intToBinary(numOnes);
      return {
        name: "One counter",
        startTape: makeTape([BLANK], countOnesInput, [BLANK], createBlanks(countResult.length), [BLANK]),
        goalTape: makeTape([BLANK], createBlanks(countOnesInput.length), [BLANK], countResult, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 3,
        allowedCharacters: [BLANK, '0', '1'],
        hints: [
          "Count in binary",
          "Increment the counter for each one",
          "Use states to remember carries"
        ],
        requiresEndState: true
      };

    case 12: // Sort
      const toSort = createArrayFromArray(getRandomInt(4, 8), ['0', '1']);
      const sorted = [...toSort].sort();
      return {
        name: "Sort",
        startTape: makeTape([BLANK], toSort, [BLANK]),
        goalTape: makeTape([BLANK], sorted, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 3,
        allowedCharacters: [BLANK, '0', '1', 'a', 'b'],
        hints: [
          "Bubble sort works well here",
          "Compare adjacent digits",
          "Swap when out of order"
        ],
        requiresEndState: true
      };

    case 13: // Multiply
      const firstFactor = getRandomInt(2, 6);
      const secondFactor = getRandomInt(2, 6);
      const firstFactorBits = intToBinary(firstFactor);
      const secondFactorBits = intToBinary(secondFactor);
      const productBits = intToBinary(firstFactor * secondFactor);
      return {
        name: "Multiply",
        startTape: makeTape([BLANK], firstFactorBits, ['x'], secondFactorBits, ['='], createBlanks(productBits.length), [BLANK]),
        goalTape: makeTape([BLANK], createBlanks(firstFactorBits.length), [BLANK], createBlanks(secondFactorBits.length), [BLANK], productBits, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 8,
        allowedCharacters: [BLANK, '0', '1', 'x', '=', 'a', 'b', 'c'],
        hints: [
          "Add the first number to itself",
          "As many times as the second number",
          "Use temporary space"
        ],
        requiresEndState: true
      };

    case 14: // Divide
      const dividend = getRandomInt(1, 31);
      const divisor = getRandomInt(1, 6);
      const quotient = Math.floor(dividend / divisor);
      const remainder = dividend % divisor;
      const dividendBits = intToBinary(dividend);
      const divisorBits = intToBinary(divisor);
      const quotientBits = intToBinary(quotient);
      const remainderBits = intToBinary(remainder);
      return {
        name: "Divide",
        startTape: makeTape([BLANK], dividendBits, ['÷'], divisorBits, ['='], createBlanks(quotientBits.length), ['r'], createBlanks(remainderBits.length), [BLANK]),
        goalTape: makeTape([BLANK], createBlanks(dividendBits.length), [BLANK], createBlanks(divisorBits.length), [BLANK], quotientBits, [BLANK], remainderBits, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 8,
        allowedCharacters: [BLANK, '0', '1', '÷', '=', 'r', 'a', 'b', 'c'],
        hints: [
          "Repeatedly subtract the divisor",
          "Count how many times you can subtract",
          "What's left is the remainder"
        ],
        requiresEndState: true
      };

    case 15: // Power
      const base = getRandomInt(2, 4);
      const exponent = getRandomInt(2, 3);
      const baseBits = intToBinary(base);
      const exponentBits = intToBinary(exponent);
      const resultBits = intToBinary(Math.pow(base, exponent));
      return {
        name: "Power",
        startTape: makeTape([BLANK], baseBits, ['^'], exponentBits, ['='], createBlanks(resultBits.length), [BLANK]),
        goalTape: makeTape([BLANK], createBlanks(baseBits.length), [BLANK], createBlanks(exponentBits.length), [BLANK], resultBits, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 8,
        allowedCharacters: [BLANK, '0', '1', '^', '=', 'a', 'b', 'c'],
        hints: [
          "Multiply the base by itself",
          "As many times as the exponent",
          "Use your multiply algorithm"
        ],
        requiresEndState: true
      };

    case 16: // Bit shifter
      const toShiftBits = createArrayFromArray(getRandomInt(4, 8), ['0', '1']);
      return {
        name: "Bit shifter",
        startTape: makeTape([BLANK], toShiftBits, ['>', '>', '>'], [BLANK]),
        goalTape: makeTape([BLANK, BLANK, BLANK], toShiftBits, [BLANK]),
        startIndex: 0,
        startState: 0,
        maxState: 5,
        allowedCharacters: [BLANK, '0', '1', '>'],
        hints: [
          "Subtract one from the right side",
          "Shift digits to the right"
        ],
        requiresEndState: true
      };

    case 17: // Copier
      const toDuplicate = createArrayFromArray(6, ['0', '1']);
      const blanks = createBlanks(toDuplicate.length);
      const firstPart = makeTape([BLANK], toDuplicate, [BLANK]);
      return {
        name: "Copier",
        startTape: makeTape(firstPart, blanks, [BLANK]),
        goalTape: makeTape(firstPart, toDuplicate, [BLANK]),
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

    case 18: // Palindrome
      let randomBinary: string[];
      do {
        randomBinary = createArrayFromArray(5, ['0', '1']);
      } while (!randomBinary.includes('1') || !randomBinary.includes('0'));
      
      return {
        name: "Palindrome",
        startTape: makeTape(randomBinary, createBlanks(randomBinary.length)),
        goalTape: makeTape(randomBinary, [...randomBinary].reverse()),
        startIndex: 0,
        startState: 0,
        maxState: 3,
        allowedCharacters: [BLANK, '0', '1', 'a'],
        hints: ["Replace 0→a, 1→b", "Then move out from center"],
        requiresEndState: false
      };

    case 19: // XOR
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

    case 20: // Mode
      const oddNumber = 2 * getRandomInt(2, 5) + 1;
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

    case 21: // Addition
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

    case 22: // Greater than or equal
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
        hints: ["Compare digits from left to right", "Keep track of the result"],
        requiresEndState: true
      };

    case 23: // Bisect
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

    case 24: // Trisect
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

    default:
      throw new Error(`Challenge ${index} not found`);
  }
} 