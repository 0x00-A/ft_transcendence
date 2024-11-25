import React from 'react';

// Adding layout prop with default to column
const PlayerCard = ({ layout = 'vertical', score, against } : {layout?: 'vertical' | 'horizontal', score: number, against: number}) => {
  const player = {
    username: "GamerPro123",
    score: 1250,
    against: 980,
    avatarUrl: "/api/placeholder/48/48"
  };

  // Determine if we should use column or row layout
  const isVertical = layout === 'vertical';

  return (
    <div className={`bg-white rounded-lg shadow-sm p-1 ${isVertical ? 'max-w-xs' : 'max-w-xs pb-0'}`}>
      {/* Container that changes between column and row */}
      <div className={`flex ${isVertical ? 'flex-col' : 'flex-row items-center justify-between'}`}>
        {/* Player info section */}
        <div className="flex flex-col items-center mb-3">
          <div className="mb-1">
            <img
              src={player.avatarUrl}
              alt="Player avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <h3 className="text-base font-medium text-gray-900">
            {player.username}
          </h3>
        </div>

        {/* Scores section */}
        <div className={`
          grid grid-cols-2 gap-1
          ${isVertical ? 'border-t pt-3 w-full' : 'border-l pl-4'}
        `}>
          <div className="text-center">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-lg font-semibold text-green-600">
              {score}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Against</p>
            <p className="text-lg font-semibold text-red-600">
              {against}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;