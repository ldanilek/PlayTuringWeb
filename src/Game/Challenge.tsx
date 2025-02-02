import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TuringTape } from './TuringTape';
import './Challenge.css';
import { 
  Tape, 
  BLANK, 
  getRandomInt, 
  createBlanks, 
  intToBinary, 
  makeTape, 
  generateChallenge
} from '@/lib/Challenges';
import { Direction, Rule } from '@/lib/TuringMachine';
import { RuleDisplay } from './RuleDisplay';
import { RuleEditor } from './RuleEditor';

interface ChallengeProps {
  index: number;
  onComplete?: () => void;
}

export function Challenge({ index, onComplete }: ChallengeProps) {
  const challenge = useMemo(() => generateChallenge(index), [index]);

  const [tape, setTape] = useState<Tape>(challenge.startTape.slice());
  const [headPosition, setHeadPosition] = useState(challenge.startIndex);
  const [currentState, setCurrentState] = useState(challenge.startState);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [alert, setAlert] = useState<string | null>(null);
  const goalTape = useMemo(() => challenge.goalTape.slice(), [challenge.goalTape]);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);

  const step = useCallback(() => {
    if (!isPlaying) return;

    const currentChar = tape[headPosition] || BLANK;
    const rule = rules.find(r => 
      r.state === currentState && 
      r.read === currentChar
    );

    if (!rule) {
      setIsPlaying(false);
      setAlert('No matching rule found!');
      return;
    }

    // Apply the rule
    const newTape = [...tape];
    newTape[headPosition] = rule.write;
    const newHeadPosition = rule.direction === Direction.Right ? headPosition + 1 : headPosition - 1;
    if (newHeadPosition < 0 || newHeadPosition >= newTape.length) {
      setIsPlaying(false);
      setAlert('Out of bounds!');
      return;
    }

    setTape(newTape);
    setCurrentState(rule.newState);
    setHeadPosition(newHeadPosition);

    // Check if goal is reached
    if (JSON.stringify(newTape) === JSON.stringify(goalTape)) {
      setIsPlaying(false);
      setAlert('Success!');
      onComplete?.();
    }
  }, [isPlaying, tape, headPosition, currentState, rules, goalTape, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(step, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, step]);

  const handleAddRule = useCallback(() => {
    setEditingRuleIndex(null);
    setIsRuleEditorOpen(true);
  }, [setEditingRuleIndex, setIsRuleEditorOpen]);

  const handleEditRule = useCallback((index: number) => {
    setEditingRuleIndex(index);
    setIsRuleEditorOpen(true);
  }, [setEditingRuleIndex, setIsRuleEditorOpen]);

  const handleSaveRule = useCallback((rule: Rule) => {
    setRules(prev => {
      if (editingRuleIndex !== null) {
        // Edit existing rule
        return prev.map((r, i) => i === editingRuleIndex ? rule : r);
      } else {
        // Add new rule
        return [...prev, rule];
      }
    });
    setIsRuleEditorOpen(false);
    setEditingRuleIndex(null);
  }, [setRules, editingRuleIndex, setIsRuleEditorOpen, setEditingRuleIndex]);

  const handleCancelRule = useCallback(() => {
    setIsRuleEditorOpen(false);
    setEditingRuleIndex(null);
  }, [setEditingRuleIndex, setIsRuleEditorOpen]);

  const handleDeleteRule = useCallback((index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  }, [setRules]);
  
  const currentRuleNeeded: Rule | undefined = useMemo(() => {
    const existingRule = rules.find(r => r.state === currentState && r.read === tape[headPosition]);
    if (existingRule) {
      return undefined;
    }
    return {
      state: currentState,
      read: tape[headPosition],
      newState: currentState,
      write: tape[headPosition],
      direction: Direction.Right,
    };
  }, [rules, currentState, tape, headPosition]);

  return (
    <div className="challenge">
      <div className="challenge-header">
        <h2 className="challenge-title">Challenge {index}</h2>
        <div className="control-buttons">
          <button 
            className="button"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          <button 
            className="button"
            onClick={step}
            disabled={isPlaying}
          >
            Step
          </button>
          <button 
            className="button"
            onClick={() => setSpeed(prev => prev * 2)}
            disabled={!isPlaying}
          >
            Speed Up
          </button>
        </div>
      </div>
      <h1>{challenge.name}</h1>

      <div className="challenge-content">
        <div className="tape-container">
          <TuringTape
            characters={tape}
            selectedIndex={headPosition}
            onTapCell={() => {}}
            state={`q${currentState}`}
          />
        </div>

        <div className="goal-tape">
          <h3>Goal</h3>
          <TuringTape
            characters={goalTape}
            onTapCell={() => {}}
          />
        </div>

        <div className="rule-container">
          {rules.map((rule, index) => (
            <div key={index} className="rule">
              <RuleDisplay rule={rule} onClick={() => handleEditRule(index)} />
              <div className="rule-actions">
                <button 
                  className="rule-button"
                  onClick={() => handleEditRule(index)}
                >
                  Edit
                </button>
                <button 
                  className="rule-button delete"
                  onClick={() => handleDeleteRule(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button 
            className="button add-rule"
            onClick={handleAddRule}
          >
            Add Rule
          </button>
        </div>
      </div>

      {alert && (
        <div className="alert">
          {alert}
        </div>
      )}

      {isRuleEditorOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <RuleEditor
              possibleCharacters={[BLANK, '0', '1']}
              maxState={3}
              hasFinalState={true}
              onSave={handleSaveRule}
              onCancel={handleCancelRule}
              initialRule={editingRuleIndex !== null ? rules[editingRuleIndex] : currentRuleNeeded}
            />
          </div>
        </div>
      )}
    </div>
  );
}
