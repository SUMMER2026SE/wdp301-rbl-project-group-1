interface ScoreDataPoint {
  label: string;
  score: number;
  maxScore: number;
}

interface ScoreStatsSectionProps {
  dataPoints: ScoreDataPoint[];
  averageScore: number;
  maxScore: number;
}

export function ScoreStatsSection({
  dataPoints,
  averageScore,
  maxScore,
}: ScoreStatsSectionProps) {
  const maxScoreValue = Math.max(...dataPoints.map((d) => d.score));

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Thống kê điểm số</h3>
      <div className="flex flex-col gap-4">
        {/* Bar chart */}
        <div className="flex items-end justify-between h-32 gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
          {dataPoints.map((point) => (
            <div key={point.label} className="flex flex-col items-center gap-2 flex-1 group">
              <div
                className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-sm relative transition-colors cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/40"
                style={{ height: `${(point.score / maxScoreValue) * 100}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {point.score}
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 rotate-[-45deg] origin-top-left mt-1 whitespace-nowrap">
                {point.label}
              </span>
            </div>
          ))}
        </div>

        {/* Average score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">Điểm trung bình</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {averageScore}/{maxScore}
          </span>
        </div>
      </div>
    </div>
  );
}
