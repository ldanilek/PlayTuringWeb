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
      return generateChallenge(0); // Default to Getting Started
  }
} 