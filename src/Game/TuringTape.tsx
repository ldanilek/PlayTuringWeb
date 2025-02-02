import './TuringTape.css';
import { TuringCell } from './TuringCell';
import { TuringHead } from './TuringHead';
import { useLayoutEffect, useRef, useState } from 'react';

interface TuringTapeProps {
  characters: (string | { char: string, options?: string[], onOptionChange?: (option: string) => void })[];
  selectedIndex?: number;
  onTapCell: (index: number) => void;
  state?: string;
  stateOptions?: string[];
  onStateChange?: (state: string) => void;
}

export function TuringTape({ characters, selectedIndex, onTapCell, state, stateOptions, onStateChange }: TuringTapeProps) {
  const [cellWidth, setCellWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateCellWidth = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const numCells = characters.length;
      const totalGapWidth = (numCells - 1) * 2; // 2px gap between cells
      const width = (containerWidth - totalGapWidth) / numCells;
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
          onClick={() => onTapCell(index)}
        />
      ))}
      {selectedIndex !== undefined && state !== undefined &&
        <TuringHead state={state} stateOptions={stateOptions} onStateChange={onStateChange} />
      }
    </div>
  );
}
