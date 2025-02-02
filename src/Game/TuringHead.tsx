import React from 'react';
import './TuringHead.css';

interface TuringHeadProps {
  state: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  stateOptions?: string[];
  onStateChange?: (state: string) => void;
}

export function TuringHead({ state, width = 40, height = 40, style, stateOptions, onStateChange }: TuringHeadProps) {
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
      <div className="turing-head-state">
        {stateOptions ? (
          <select
            value={state}
            onChange={(e) => onStateChange?.(e.target.value)}
          >
            {stateOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          state
        )}
      </div>
    </div>
  );
}
