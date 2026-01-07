import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './VotingChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function VotingChart({ question, labels, data, colors }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Votes',
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
        animation: {
          duration: 500,
          easing: 'easeInOutQuart'
        }
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y} votes`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 500,
    },
  };

  const totalVotes = data.reduce((sum, val) => sum + val, 0);

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
      <div className="vote-counts">
        {labels.map((label, index) => (
          <div key={index} className="vote-count-item">
            <span className="vote-label">{label}:</span>
            <span className="vote-number">{data[index]}</span>
            {totalVotes > 0 && (
              <span className="vote-percentage">
                ({Math.round((data[index] / totalVotes) * 100)}%)
              </span>
            )}
          </div>
        ))}
        <div className="total-votes">
          Total Votes: {totalVotes}
        </div>
      </div>
    </div>
  );
}

export default VotingChart;

