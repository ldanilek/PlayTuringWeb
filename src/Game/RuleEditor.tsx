import { useState, useCallback, useMemo } from 'react';
import { Rule, Direction, State } from '../lib/TuringMachine';
import { RuleDisplay } from './RuleDisplay';
import { TuringTape } from './TuringTape';
import './RuleEditor.css';

interface RuleEditorProps {
  possibleCharacters: string[];
  maxState: number;
  hasFinalState?: boolean;
  onSave: (rule: Rule) => void;
  onCancel: () => void;
  initialRule?: Rule;
}

export function RuleEditor({
  possibleCharacters,
  maxState,
  hasFinalState = false,
  onSave,
  onCancel,
  initialRule
}: RuleEditorProps) {
  // State management
  const [startingState, setStartingState] = useState<State>(initialRule?.state ?? 0);
  const [endState, setEndState] = useState<State>(initialRule?.newState ?? 0);
  const [readingCharacter, setReadingCharacter] = useState<string>(initialRule?.read ?? possibleCharacters[0]);
  const [writeCharacter, setWriteCharacter] = useState<string>(initialRule?.write ?? possibleCharacters[0]);
  const [direction, setDirection] = useState<Direction>(initialRule?.direction ?? Direction.Left);

  // Current rule based on state
  const currentRule: Rule = useMemo(() => ({
    state: startingState,
    read: readingCharacter,
    newState: endState,
    write: writeCharacter,
    direction: direction
  }), [startingState, endState, readingCharacter, writeCharacter, direction]);

  const startingStateOptions = useMemo(() => {
    return Array.from({ length: maxState + 1 }, (_, i) => `q${i}`);
  }, [maxState]);

  const endStateOptions = useMemo(() => {
    return Array.from({ length: maxState + (hasFinalState ? 2 : 1) }, (_, i) => `q${i}`);
  }, [maxState, hasFinalState]);

  const handleSave = useCallback(() => {
    onSave(currentRule);
  }, [currentRule, onSave]);

  return (
    <div className="rule-editor">
      <div className="rule-editor-header">
        <h3>Edit Rule</h3>
        <div className="rule-editor-preview">
          <RuleDisplay rule={currentRule} onClick={() => {}} />
        </div>
      </div>

      <div className="rule-editor-content">
        <div className="tape-section">
          <div className="condition-tape">
            <TuringTape
              characters={["", {
                char: readingCharacter,
                options: possibleCharacters,
                onOptionChange: (option) => setReadingCharacter(option)
              }, ""]}
              selectedIndex={1}
              state={`q${startingState}`}
              onTapCell={() => {}}
              stateOptions={startingStateOptions}
              onStateChange={(state) => setStartingState(parseInt(state.slice(1)))}
            />
          </div>

          <div className="result-tape">
            <TuringTape
              characters={[direction === Direction.Left ? "" : "click", {
                char: writeCharacter,
                options: possibleCharacters,
                onOptionChange: (option) => setWriteCharacter(option)
              }, direction === Direction.Left ? "click" : ""]}
              selectedIndex={direction === Direction.Left ? 0 : 2}
              onTapCell={(tappedIndex) => {
                if (tappedIndex === 0) {
                  setDirection(Direction.Left);
                } else if (tappedIndex === 2) {
                  setDirection(Direction.Right);
                }
              }}
              state={`q${endState}`}
              stateOptions={endStateOptions}
              onStateChange={(state) => setEndState(parseInt(state.slice(1)))}
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
