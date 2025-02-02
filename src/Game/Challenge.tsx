import { useCallback, useEffect, useMemo, useState } from 'react';
import { TuringTape } from './TuringTape';
import './Challenge.css';
import { 
  Tape, 
  generateChallenge,
} from '@/lib/Challenges';
import { calculateAccuracy, Direction, mapRule } from '../lib/TuringMachine';
import { RuleDisplay } from './RuleDisplay';
import { RuleEditor } from './RuleEditor';
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useNavigate } from 'react-router-dom';
import { Rule } from '../lib/TuringMachine';

interface ChallengeProps {
  index: number;
  onComplete?: () => void;
}

export function Challenge({ index: challengeIndex, onComplete }: ChallengeProps) {
  const navigate = useNavigate();
  const markChallengeCompleted = useMutation(api.challengeAttempts.challengeCompleted);
  const [reloadCount, setReloadCount] = useState(0);
  const challenge = useMemo(() => generateChallenge(challengeIndex), [challengeIndex, reloadCount]);
  const challengeName = useMemo(() => challenge.name, [challenge]);

  const [tape, setTape] = useState<Tape>(challenge.startTape.slice());
  const [headPosition, setHeadPosition] = useState(challenge.startIndex);
  const [currentState, setCurrentState] = useState(challenge.startState);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [alert, setAlert] = useState<string | null>(null);
  const goalTape = useMemo(() => challenge.goalTape.slice(), [challenge.goalTape]);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);
  const [highlightedRule, setHighlightedRule] = useState<Rule | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState(false);

  const rulesRaw = useQuery(api.rules.getRules, { challengeName });
  const rules: Rule[] | undefined = useMemo(() => rulesRaw?.map(mapRule), [rulesRaw]);
  const saveRule = useMutation(api.rules.createRule).withOptimisticUpdate((localStore, args) => {
    const prev = localStore.getQuery(api.rules.getRules, { challengeName: args.challengeName });
    if (prev === undefined) {
      throw new Error('Rules are not loaded');
    }
    const rule = args.rule;
    const replacingRule = args.replacingRule;
    const matchingRuleIndex = prev.findIndex(r => r.state === rule.state && r.read === rule.read);
    let newRules = prev;
    if (replacingRule !== undefined && matchingRuleIndex !== -1) {
      // Edit existing rule, delete matching
      newRules = prev
        .map((r, i) => i === matchingRuleIndex ? rule : r)
        .filter(r => r !== null);
    } else if (replacingRule !== undefined) {
      // Replace rule being edited
      newRules = prev.map((r, i) => i === matchingRuleIndex ? rule : r);
    } else if (matchingRuleIndex !== -1) {
      // Replace matching rule
      newRules = prev.map((r, i) => i === matchingRuleIndex ? rule : r);
    } else {
      // Add new rule
      newRules = [rule, ...prev];
    }
    localStore.setQuery(api.rules.getRules, { challengeName: args.challengeName }, newRules);
  });
  const deleteRule = useMutation(api.rules.deleteRule).withOptimisticUpdate((localStore, args) => {
    const prev = localStore.getQuery(api.rules.getRules, { challengeName: args.challengeName });
    if (prev === undefined) {
      throw new Error('Rules are not loaded');
    }
    const newRules = prev.filter((rule) => rule.state !== args.rule.state || rule.read !== args.rule.read);
    localStore.setQuery(api.rules.getRules, { challengeName: args.challengeName }, newRules);
  });

  const startOver = useCallback(() => {
    setTape(challenge.startTape.slice());
    setHeadPosition(challenge.startIndex);
    setCurrentState(challenge.startState);
  }, [challenge]);

  useEffect(() => {
    startOver();
  }, [challenge]);

  const [addRuleHighlight, setAddRuleHighlight] = useState(false);

  const step = useCallback(() => {
    if (headPosition < 0 || headPosition >= tape.length) {
      throw new Error("Head position out of bounds");
    }
    if (rules === undefined) {
      setAlert('Loading rules...');
      return;
    }

    const currentChar = tape[headPosition];
    const rule = rules.find(r => 
      r.state === currentState && 
      r.read === currentChar
    );

    if (!rule) {
      setIsPlaying(false);
      setAlert('No matching rule found!');
      setAddRuleHighlight(true);
      return;
    }

    setHighlightedRule(rule);

    // Apply the rule
    const newTape = [...tape];
    newTape[headPosition] = rule.write;
    const newHeadPosition = rule.direction === Direction.Right ? headPosition + 1 : headPosition - 1;
    const newState = rule.newState;

    // Check if goal is reached
    if (JSON.stringify(newTape) === JSON.stringify(goalTape) &&
        (!challenge.requiresEndState || newState === challenge.maxState + 1)) {
      setTape(newTape);
      setCurrentState(newState);
      setIsPlaying(false);
      const accuracy = calculateAccuracy(rules, challengeIndex);
      if (!accuracy) {
        setAlert('You solved this instance of the challenge, but missed some edge cases! Try "Reload".');
        return;
      }
      setIsSuccess(true);
      setAlert('Success! You did it! Try another challenge!');
      void markChallengeCompleted({ challengeName });
      onComplete?.();
      return;
    }

    if (newHeadPosition < 0 || newHeadPosition >= newTape.length) {
      setIsPlaying(false);
      setAlert('Out of bounds!');
      return;
    }

    setTape(newTape);
    setCurrentState(newState);
    setHeadPosition(newHeadPosition);

  }, [isPlaying, tape, headPosition, currentState, rules, goalTape, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(step, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, step]);

  const handleAddRule = useCallback(() => {
    setEditingRule(undefined);
    setIsRuleEditorOpen(true);
    setAlert(null);
    setAddRuleHighlight(false);
  }, [setEditingRule, setIsRuleEditorOpen]);

  const handleEditRule = useCallback((editAtIndex: number) => {
    if (rules === undefined) {
      throw new Error('Rules are not loaded');
    }
    setEditingRule(rules[editAtIndex]);
    setIsRuleEditorOpen(true);
    setAlert(null);
    setAddRuleHighlight(false);
  }, [setEditingRule, setIsRuleEditorOpen, rules]);

  const handleSaveRule = useCallback((rule: Rule) => {
    void saveRule({ challengeName, rule, replacingRule: editingRule });
    setAlert(null);
    setIsRuleEditorOpen(false);
    setEditingRule(undefined);
    startOver();
    setHighlightedRule(rule);
    setIsPlaying(true);
  }, [setEditingRule, setIsRuleEditorOpen, startOver, saveRule, editingRule]);

  const handleCancelRule = useCallback(() => {
    setIsRuleEditorOpen(false);
    setEditingRule(undefined);
    setAddRuleHighlight(false);
  }, [setEditingRule, setIsRuleEditorOpen]);

  const handleDeleteRule = useCallback((deleteAtIndex: number) => {
    if (rules === undefined) {
      throw new Error('Rules are not loaded');
    }
    void deleteRule({ challengeName, rule: rules[deleteAtIndex] });
    startOver();
    setIsPlaying(true);
    setAddRuleHighlight(false);
  }, [deleteRule, rules]);
  
  const currentRuleNeeded: Rule | undefined = useMemo(() => {
    const existingRule = rules?.find(r => r.state === currentState && r.read === tape[headPosition]);
    if (existingRule) {
      return undefined;
    }
    return {
      state: currentState,
      read: tape[headPosition],
      newState: currentState,
      write: tape[headPosition],
      direction: Direction.Left,
    };
  }, [rules, currentState, tape, headPosition]);

  const [hintIndex, setHintIndex] = useState<number | null>(0);

  return (
    <div className="challenge">
      <div className="challenge-header">
        <h2 className="challenge-title">Challenge {challengeIndex}</h2>
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
            onClick={() => {
              if (hintIndex === null) {
                setHintIndex(0);
                setAlert(null);
              } else if (hintIndex < challenge.hints.length) {
                setAlert(challenge.hints[hintIndex]);
                setHintIndex(hintIndex + 1);
              } else {
                setAlert("No more hints, you're on your own!");
                setHintIndex(null);
              }
            }}
          >
            Hint
          </button>
          <button 
            className="button"
            onClick={() => {
              setReloadCount(reloadCount + 1);
              setIsPlaying(false);
              setAlert(null);
            }}
          >
            Reload
          </button>
          <button 
            className="button"
            onClick={() => setSpeed(prev => speed < 16 ? prev * 2 : 1)}
            disabled={!isPlaying}
          >
            { speed < 16 ? 'Speed Up' : 'Reset Speed' }
          </button>
        </div>
      </div>
      <h1>{challenge.name}</h1>

      <div className="challenge-content">
        <TuringTape
          characters={tape}
          selectedIndex={headPosition}
          onTapCell={() => {}}
          state={currentState}
          customStates={challenge.customStates}
        />

        <div className="goal-tape">
          <h3>Goal</h3>
          <TuringTape
            characters={goalTape}
            onTapCell={() => {}}
            customStates={challenge.customStates}
          />
        </div>

        <div className="rule-container">
          <button 
            className={`button add-rule ${rules?.length === 0 || addRuleHighlight ? 'help-clickable' : ''}`}
            onClick={handleAddRule}
          >
            Add Rule
          </button>
          {rules?.map((rule, ruleIndex) => (
            <div key={ruleIndex} className={`rule ${highlightedRule?.state === rule.state && highlightedRule?.read === rule.read ? 'highlighted' : ''}`}>
              <RuleDisplay rule={rule} onClick={() => handleEditRule(ruleIndex)} customStates={challenge.customStates} />
              <div className="rule-actions">
                <button 
                  className="rule-button"
                  onClick={() => handleEditRule(ruleIndex)}
                >
                  Edit
                </button>
                <button 
                  className="rule-button delete"
                  onClick={() => handleDeleteRule(ruleIndex)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
              possibleCharacters={challenge.allowedCharacters}
              maxState={challenge.maxState}
              hasFinalState={challenge.requiresEndState}
              onSave={handleSaveRule}
              onCancel={handleCancelRule}
              initialRule={editingRule ?? currentRuleNeeded}
              customStates={challenge.customStates}
            />
          </div>
        </div>
      )}

      {isSuccess && (
        <button 
          className="more-challenges"
          onClick={() => navigate('/')}
        >
          More Challenges →
        </button>
      )}
    </div>
  );
}
