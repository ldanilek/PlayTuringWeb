import React from 'react';
import './TuringHead.css';
import { getState } from '@/lib/Challenges';

interface TuringHeadProps {
  state: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  stateOptions?: number[];
  onStateChange?: (state: number) => void;
  highlight?: boolean;
  customStates: string[] | undefined;
}

export function TuringHead({ state, width = 40, height = 40, style, stateOptions, onStateChange, highlight, customStates }: TuringHeadProps) {
  return (
    <div 
      className="turing-head"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style
      }}
    >
      <div className="turing-head-arrow" />
      <div className={`turing-head-state ${highlight ? 'help-highlight' : ''}`}>
        {stateOptions ? (
          <select
            value={state}
            onChange={(e) => onStateChange?.(parseInt(e.target.value))}
          >
            {stateOptions.map((option) => (
              <option key={option} value={option}>{getState(customStates, option)}</option>
            ))}
          </select>
        ) : (
          getState(customStates, state)
        )}
      </div>
    </div>
  );
}
