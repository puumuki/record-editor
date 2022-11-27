import scoresToPerformanceIndex from "../lib/performance-index";

interface ScoreProps {
  score?: number
}

const Score = (props:ScoreProps) => {

  const {score} = props;
  const performanceIndex = scoresToPerformanceIndex( score )
  const scoreText = score === 0 ? '' : score;

  return (
    <span className={`score ${performanceIndex.color}`}>{performanceIndex.name} <span className="points">{scoreText}</span></span>
  );
}

export default Score;