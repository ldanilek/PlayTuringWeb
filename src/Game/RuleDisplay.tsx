import React from 'react';
import { Rule, Direction } from '../lib/TuringMachine';
import './RuleDisplay.css';

interface RuleDisplayProps {
  rule: Rule;
  onClick: () => void;
}

export function RuleDisplay({ rule, onClick }: RuleDisplayProps) {
  const directionSymbol = rule.direction === Direction.Left ? '⬅︎' : '➡︎';
  const stateText = `q${rule.state}`;
  const newStateText = `q${rule.newState}`;

  return (
    <div className="rule-display" onClick={onClick}>
      <div className="rule-left">
        <span className="rule-text">Read</span>
        <span className="rule-char">{rule.read}</span>
        <span className="rule-text">in</span>
        <span className="rule-state">{stateText}</span>
      </div>
      <div className="rule-arrow">⇒</div>
      <div className="rule-right">
        {rule.newState === rule.state ? (
          rule.read === rule.write ? (
            <span className="rule-text">move</span>
          ) : (
            <>
              <span className="rule-text">write</span>
              <span className="rule-char">{rule.write}</span>
            </>
          )
        ) : (
          <>
            {rule.read !== rule.write && (
              <>
                <span className="rule-text">write</span>
                <span className="rule-char">{rule.write}</span>
                <span className="rule-text">,</span>
              </>
            )}
            <span className="rule-text">set to</span>
            <span className="rule-state">{newStateText}</span>
          </>
        )}
        {(rule.newState !== rule.state || rule.read !== rule.write) && (
          <span className="rule-text">,</span>
        )}
        <span className="rule-direction">{directionSymbol}</span>
      </div>
    </div>
  );
}
