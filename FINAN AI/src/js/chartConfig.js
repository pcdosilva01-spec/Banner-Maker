// Chart.js Configuration
export const chartDefaults = {
  font: {
    family: "'Inter', sans-serif",
    size: 12
  },
  color: '#94A3B8',
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 15,
        usePointStyle: true,
        font: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#FFFFFF',
      bodyColor: '#94A3B8',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 13,
        weight: 'bold'
      },
      bodyFont: {
        size: 12
      }
    }
  }
};

export function applyChartDefaults(Chart) {
  Chart.defaults.font = chartDefaults.font;
  Chart.defaults.color = chartDefaults.color;
}
