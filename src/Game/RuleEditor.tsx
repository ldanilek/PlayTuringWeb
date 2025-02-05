import { useState, useCallback, useMemo } from 'react';
import { Rule, Direction, State } from '../lib/TuringMachine';
import { RuleDisplay } from './RuleDisplay';
import { TuringTape } from './TuringTape';
import './RuleEditor.css';
import { getState } from '@/lib/Challenges';

interface RuleEditorProps {
  possibleCharacters: string[];
  maxState: number;
  hasFinalState?: boolean;
  onSave: (rule: Rule) => void;
  onCancel: () => void;
  initialRule?: Rule;
  customStates: string[] | undefined;
  tapeLength: number;
}

export function HelpButton({ onHint, finalState }: { onHint: (hintIndex?: number) => void; finalState: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const helpTexts = [
    "Rules have two conditions and three actions",
    "Click to change any condition or action",
    "Condition: in this state",
    "Condition: read this character",
    "Action: write this character",
    "Action: change to this state",
    "Action: move left or right",
  ];
  if (finalState !== null) {
    helpTexts.push(`NOTE: You must end in the final state ${finalState}`);
  }

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onHint(prevIndex);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = currentIndex === helpTexts.length - 1 ? currentIndex : currentIndex + 1;
    setCurrentIndex(nextIndex);
    onHint(nextIndex);
  };

  return (
    <div className="help-container">
      <button className="help-button" onClick={() => {
        setCurrentIndex(0);
        setIsOpen(!isOpen);
        onHint(!isOpen ? 0 : undefined);
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">?</text>
        </svg>
      </button>
      {isOpen && (
        <div className="help-tooltip">
          <div className="help-navigation">
            <div className="nav-buttons">
              <button 
                onClick={goToPrev} 
                className="nav-button"
                disabled={currentIndex === 0}
              >
                ←
              </button>
              <button 
                onClick={goToNext} 
                className="nav-button"
                disabled={currentIndex === helpTexts.length - 1}
              >
                →
              </button>
            </div>
            <p>{helpTexts[currentIndex]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function RuleEditor({
  possibleCharacters,
  maxState,
  hasFinalState = false,
  onSave,
  onCancel,
  initialRule,
  customStates,
  tapeLength,
}: RuleEditorProps) {
  // State management
  const [startingState, setStartingState] = useState<State>(initialRule?.state ?? 0);
  const [endState, setEndState] = useState<State>(initialRule?.newState ?? 0);
  const [readingCharacter, setReadingCharacter] = useState<string>(initialRule?.read ?? possibleCharacters[0]);
  const [writeCharacter, setWriteCharacter] = useState<string>(initialRule?.write ?? possibleCharacters[0]);
  const [direction, setDirection] = useState<Direction>(initialRule?.direction ?? Direction.Left);

  // Which of the things have they clicked on?
  const [clickedStartState, setClickedStartState] = useState(maxState === 0 || initialRule !== undefined);
  const [clickedReadCharacter, setClickedReadCharacter] = useState(initialRule !== undefined);
  const [clickedEndState, setClickedEndState] = useState(maxState === 0 && !hasFinalState);
  const [clickedWriteCharacter, setClickedWriteCharacter] = useState(false);
  const [clickedDirection, setClickedDirection] = useState(tapeLength === 1);

  // Current rule based on state
  const currentRule: Rule = useMemo(() => ({
    state: startingState,
    read: readingCharacter,
    newState: endState,
    write: writeCharacter,
    direction: direction
  }), [startingState, endState, readingCharacter, writeCharacter, direction]);

  const startingStateOptions = useMemo(() => {
    return Array.from({ length: maxState + 1 }, (_, i) => i);
  }, [maxState]);

  const endStateOptions = useMemo(() => {
    return Array.from({ length: maxState + (hasFinalState ? 2 : 1) }, (_, i) => i);
  }, [maxState, hasFinalState]);

  const handleSave = useCallback(() => {
    onSave(currentRule);
  }, [currentRule, onSave]);

  const [hintIndex, setHintIndex] = useState<number | undefined>(undefined);

  function directionTape(direction: Direction) {
    return {
      char: direction === Direction.Left ? "⬅︎" : "➡︎",
      highlight: (hintIndex === 6 || hintIndex === 1) ? 'highlight' as const : (hintIndex === undefined && !clickedDirection) ? 'clickable' as const : undefined
    };
  }

  return (
    <div className="rule-editor">
      <div className="rule-editor-header">
        <h3>Edit Rule <HelpButton onHint={setHintIndex} finalState={hasFinalState ? getState(customStates, maxState + 1) : null} /></h3>
        <div className={`rule-editor-preview ${hintIndex === 0 ? 'help-highlight' : ''}`}>
          <RuleDisplay rule={currentRule} onClick={() => {}} customStates={customStates} />
        </div>
      </div>

      <div className="rule-editor-content">
        <div className="tape-section">
          <p>Choose start state and character:</p>
          <div className="condition-tape">
            <TuringTape
              characters={["", {
                char: readingCharacter,
                options: possibleCharacters,
                onOptionChange: setReadingCharacter,
                onClick: () => setClickedReadCharacter(true),
                highlight: (hintIndex === 3 || hintIndex === 1) ? 'highlight' : (hintIndex === undefined && !clickedReadCharacter) ? 'clickable' : undefined
              }, ""]}
              selectedIndex={1}
              state={startingState}
              onTapCell={() => {}}
              stateOptions={startingStateOptions}
              onStateChange={setStartingState}
              highlightState={(hintIndex === 2 || hintIndex === 1) ? 'highlight' : (hintIndex === undefined && !clickedStartState) ? 'clickable' : undefined}
              customStates={customStates}
              onClickState={() => setClickedStartState(true)}
            />
          </div>

          <p>Choose output state, direction, and character:</p>
          <div className="result-tape">
            <TuringTape
              characters={[directionTape(Direction.Left), {
                char: writeCharacter,
                options: possibleCharacters,
                onOptionChange: (option) => setWriteCharacter(option),
                highlight: (hintIndex === 4 || hintIndex === 1) ? 'highlight' : (hintIndex === undefined && !clickedWriteCharacter) ? 'clickable' : undefined,
                onClick: () => setClickedWriteCharacter(true),
              }, directionTape(Direction.Right)]}
              selectedIndex={direction === Direction.Left ? 0 : 2}
              onTapCell={(tappedIndex) => {
                if (tappedIndex === 0) {
                  setDirection(Direction.Left);
                  setClickedDirection(true);
                } else if (tappedIndex === 2) {
                  setDirection(Direction.Right);
                  setClickedDirection(true);
                }
              }}
              state={endState}
              stateOptions={endStateOptions}
              onStateChange={setEndState}
              highlightState={(hintIndex === 5 || hintIndex === 1 || hintIndex === 7) ? 'highlight' : (hintIndex === undefined && !clickedEndState) ? 'clickable' : undefined}
              customStates={customStates}
              onClickState={() => setClickedEndState(true)}
            />
          </div>
        </div>
      </div>

      <div className="rule-editor-footer">
        <button className="cancel-button" onClick={onCancel}>Cancel</button>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
