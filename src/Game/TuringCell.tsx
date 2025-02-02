import './TuringCell.css';

interface TuringCellProps {
  char: string;
  isSelected?: boolean;
  onClick: () => void;
  options?: string[];
  onOptionChange?: (option: string) => void;
}

export function TuringCell({ char, isSelected, onClick, options, onOptionChange }: TuringCellProps) {
  return (
    <div
      className={`tape-cell ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {options ? (
        <select
          className="option"
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