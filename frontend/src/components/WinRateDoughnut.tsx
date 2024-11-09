import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const WinRateDoughnut = () => {
  const data = {
    datasets: [
      {
        data: [76, 24],
        backgroundColor: ['#F8C25C', '#D9D9D9'],
        borderWidth: 0,
        hoverOffset: 2,
      },
    ],
  };

  const options = {
    cutout: '75%', 
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '50%', // Adjusted to 50%
          left: '50%', // Adjusted to 50%
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#F8F3E3' }}>Win Rate</span>
        <br />
        <span style={{fontWeight: 'bold', color: '#F8F3E3' }}>76%</span>
      </div>
    </div>
  );
};

export default WinRateDoughnut;
