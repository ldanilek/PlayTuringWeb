import './TuringCell.css';

interface TuringCellProps {
  char: string;
  isSelected?: boolean;
  onClick: () => void;
  options?: string[];
  onOptionChange?: (option: string) => void;
  highlight?: boolean;
}

export function TuringCell({ char, isSelected, onClick, options, onOptionChange, highlight }: TuringCellProps) {
  return (
    <div
      className={`tape-cell ${isSelected ? 'selected' : ''} ${highlight ? 'help-highlight' : ''}`}
      onClick={onClick}
    >
      {options ? (
        <select
          className={`cell-option`}
          onChange={(e) => onOptionChange?.(e.target.value)}
          value={char}
        >
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : char}
    </div>
  );
} 