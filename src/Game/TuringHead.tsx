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
  highlight?: 'highlight' | 'clickable';
  customStates: string[] | undefined;
  onClickState?: () => void;
}

export function TuringHead({ state, width = 40, height = 40, style, stateOptions, onStateChange, highlight, customStates, onClickState }: TuringHeadProps) {
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
      <div className={`turing-head-state ${highlight === 'highlight' ? 'help-highlight' : highlight === 'clickable' ? 'help-clickable' : ''}`}>
        {stateOptions ? (
          <select
            value={state}
            onChange={(e) => onStateChange?.(parseInt(e.target.value))}
            onClick={onClickState}
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
