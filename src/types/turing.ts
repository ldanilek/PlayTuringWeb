export interface TuringTapeViewDelegate {
  numberOfCharacters: () => number;
  characterAtIndex: (index: number) => string;
  tapAtIndex: (index: number) => void;
} 