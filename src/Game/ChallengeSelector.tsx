import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TuringTape } from './TuringTape';
import './ChallengeSelector.css';

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
  
  // State for selected indices in each row
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() => 
    Array.from({ length: LEVEL_LINES }, () => 
      Math.random() < 0.5 ? leftHalf(LEVELS_PER_LINE) : Math.floor(LEVELS_PER_LINE / 2) + 1
    )
  );

  const [isAnimating, setIsAnimating] = useState(true);

  // Animation function
  const animate = useCallback(() => {
    if (!isAnimating) return;

    setSelectedIndices(prev => prev.map(index => {
      if (index === 0) {
        return 1;
      } else if (index === LEVELS_PER_LINE - 1) {
        return LEVELS_PER_LINE - 2;
      } else {
        return index + (Math.random() < 0.5 ? -1 : 1);
      }
    }));
  }, [isAnimating]);

  // Start/stop animation on mount/unmount
  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(animate, 1000);
    return () => clearInterval(interval);
  }, [animate, isAnimating]);

  // Stop animation when component unmounts
  useEffect(() => {
    return () => setIsAnimating(false);
  }, []);

  const handleChallengeSelect = useCallback((index: number) => {
    setIsAnimating(false);
    navigate(`/challenge/${index}`);
  }, [navigate]);

  return (
    <div className="challenge-selector">
      <h1 className="challenge-selector-title">Select Challenge</h1>
      
      <div className="challenge-grid">
        {Array.from({ length: LEVEL_LINES }).map((_, rowIndex) => (
          <div key={rowIndex} className="challenge-row">
            <div className="tape-section">
              <TuringTape
                characters={Array.from({ length: LEVELS_PER_LINE }, (_, i) => 
                  `${rowIndex * LEVELS_PER_LINE + i}`
                )}
                selectedIndex={selectedIndices[rowIndex]}
                onTapCell={(index) => {
                  handleChallengeSelect(rowIndex * LEVELS_PER_LINE + index);
                }}
                state=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
