import './TuringTape.css';
import { TuringCell } from './TuringCell';
import { TuringHead } from './TuringHead';
import { useLayoutEffect, useRef, useState } from 'react';

interface TuringTapeProps {
  characters: (string | { char: string, highlight: 'highlight' | 'clickable' | undefined } | { char: string, options?: string[], onOptionChange?: (option: string) => void, onClick?: () => void, highlight: 'highlight' | 'clickable' | undefined })[];
  selectedIndex?: number;
  onTapCell: (index: number) => void;
  state?: number;
  stateOptions?: number[];
  onStateChange?: (state: number) => void;
  highlightState?: 'highlight' | 'clickable';
  customStates: string[] | undefined;
  onClickState?: () => void;
}

export function TuringTape({ characters, selectedIndex, onTapCell, state, stateOptions, onStateChange, highlightState, customStates, onClickState }: TuringTapeProps) {
  const [cellWidth, setCellWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateCellWidth = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const numCells = characters.length;
      const width = containerWidth / numCells;
      setCellWidth(width);
    };

    updateCellWidth();
    window.addEventListener('resize', updateCellWidth);
    return () => window.removeEventListener('resize', updateCellWidth);
  }, [characters.length]);

  return (
    <div 
      ref={containerRef}
      className="tape-container"
      style={{
        '--selected-index': selectedIndex,
        '--actual-cell-width': `${cellWidth}px`
      } as React.CSSProperties}
    >
      {characters.map((char, index) => (
        <TuringCell
          key={index}
          char={typeof char === 'string' ? char : char.char}
          options={typeof char === 'object' && 'options' in char ? char.options : undefined}
          onOptionChange={typeof char === 'object' && 'onOptionChange' in char ? char.onOptionChange : undefined}
          isSelected={index === selectedIndex}
          onClick={() => {
            onTapCell(index);
            if (typeof char === 'object' && 'onClick' in char) {
              char.onClick?.();
            }
          }}
          highlight={typeof char === 'object' && 'highlight' in char ? char.highlight : undefined}
        />
      ))}
      {selectedIndex !== undefined && state !== undefined &&
        <TuringHead state={state} stateOptions={stateOptions} onStateChange={onStateChange} highlight={highlightState} customStates={customStates} onClickState={onClickState} />
      }
    </div>
  );
}
