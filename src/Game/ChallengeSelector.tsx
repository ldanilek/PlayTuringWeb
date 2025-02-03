import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TuringTape } from './TuringTape';
import './ChallengeSelector.css';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { generateChallenge } from '@/lib/Challenges';

const LEVELS_PER_LINE = 5;
const LEVEL_LINES = 5;

export function ChallengeSelector() {
  const navigate = useNavigate();

  const challengeAttempts = useQuery(api.challengeAttempts.getChallengeAttempts);

  const firstUncompletedChallenge = useMemo(() => {
    if (!challengeAttempts) {
      return 0;
    }
    let lastCompletedChallenge = -1;
    for (let i = 0; i < LEVEL_LINES * LEVELS_PER_LINE; i++) {
      const challengeIndex = i;
      const challenge = generateChallenge(challengeIndex);
      const challengeName = challenge.name;
      if (challengeAttempts.some(attempt => attempt.challengeName === challengeName && attempt.completed)) {
        lastCompletedChallenge = challengeIndex;
      }
    }
    return lastCompletedChallenge + 1;
  }, [challengeAttempts]);
  
  const handleChallengeSelect = useCallback((index: number) => {
    void navigate(`/challenge/${index}`);
  }, [navigate]);

  function isChallengeCompleted(challengeIndex: number) {
    const challenge = generateChallenge(challengeIndex);
    const challengeName = challenge.name;
    return challengeAttempts?.some(attempt => attempt.challengeName === challengeName && attempt.completed);
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
              selectedIndex={Math.floor(firstUncompletedChallenge / LEVELS_PER_LINE) === rowIndex ? firstUncompletedChallenge % LEVELS_PER_LINE : undefined}
              onTapCell={(index) => {
                handleChallengeSelect(rowIndex * LEVELS_PER_LINE + index);
              }}
              state={0}
              customStates={[""]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
