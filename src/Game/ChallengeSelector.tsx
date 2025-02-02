import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TuringTape } from './TuringTape';
import './ChallengeSelector.css';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';

const LEVELS_PER_LINE = 5;
const LEVEL_LINES = 5;

function leftHalf(i: number): number {
  if (i % 2 === 1) {
    return Math.floor(i / 2) - 1;
  }
  return Math.floor(i / 2);
}

export function ChallengeSelector() {
  const navigate = useNavigate();

  const challengeAttempts = useQuery(api.challengeAttempts.getChallengeAttempts);
  
  // State for selected indices in each row
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() => 
    Array.from({ length: LEVEL_LINES }, () => 
      Math.random() < 0.5 ? leftHalf(LEVELS_PER_LINE) : Math.floor(LEVELS_PER_LINE / 2) + 1
    )
  );

  // Animation function
  const animate = useCallback(() => {
    setSelectedIndices(prev => prev.map(index => {
      if (index === 0) {
        return 1;
      } else if (index === LEVELS_PER_LINE - 1) {
        return LEVELS_PER_LINE - 2;
      } else {
        return index + (Math.random() < 0.5 ? -1 : 1);
      }
    }));
  }, [setSelectedIndices]);

  // Start/stop animation on mount/unmount
  useEffect(() => {
    const interval = setInterval(animate, 1000);
    return () => clearInterval(interval);
  }, [animate]);

  const handleChallengeSelect = useCallback((index: number) => {
    navigate(`/challenge/${index}`);
  }, [navigate]);

  function isChallengeCompleted(index: number) {
    return challengeAttempts?.some(attempt => attempt.index === index && attempt.completed);
  }

  return (
    <div className="challenge-selector">
      <h1 className="challenge-selector-title">Select Challenge</h1>
      
      <div className="challenge-grid">
        {Array.from({ length: LEVEL_LINES }).map((_, rowIndex) => (
          <div key={rowIndex} className="challenge-row">
            <TuringTape
              characters={Array.from({ length: LEVELS_PER_LINE }, (_, i) => 
                `${rowIndex * LEVELS_PER_LINE + i}` + (isChallengeCompleted(rowIndex * LEVELS_PER_LINE + i) ? " ✅" : "")
              )}
              selectedIndex={selectedIndices[rowIndex]}
              onTapCell={(index) => {
                handleChallengeSelect(rowIndex * LEVELS_PER_LINE + index);
              }}
              state=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
