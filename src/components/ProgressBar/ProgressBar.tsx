// ProgressBar.tsx

import React from 'react'

interface ProgressBarProps {
  progress: number // Progress from 0 to 100
  color?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`bg-[${
          color || '#22C55E'
        }] h-2 rounded-full transition-all duration-300`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  )
}

export default ProgressBar