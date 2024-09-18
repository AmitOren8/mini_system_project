import Chart from 'chart.js/auto';

const chartSetup = (nodeID: string) => {
  const ctxChart = document.getElementById(`plot-${nodeID}`) as HTMLCanvasElement;

  const borderWidth = 3;
  const fontColor = 'white';
  const fontSize = 20;

  const chart = new Chart(ctxChart, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature',
          data: [],
          borderWidth: borderWidth,
          yAxisID: 'temperature-y-axis',
        },
        {
          label: 'CO2',
          data: [],
          borderWidth: borderWidth,
          yAxisID: 'co2-y-axis',
        },
        {
          label: 'C2H4',
          data: [],
          borderWidth: borderWidth,
          yAxisID: 'c2h4-y-axis',
        },
        {
          label: 'Humidity',
          data: [],
          borderWidth: borderWidth,
          yAxisID: 'humidity-y-axis',
        },
      ],
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        // title: {
        //   display: true,
        //   text: '',
        //   color: fontColor,
        //   font: {
        //     size: 24,
        //     weight: 'bold',
        //   },
        // },
        legend: {
          position: 'bottom',
          labels: {
            color: fontColor,
            font: {
              size: 15,
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: fontColor,
          },
          title: {
            display: true,
            text: 'Time',
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
        },
        'temperature-y-axis': {
          beginAtZero: true,
          suggestedMax: 20,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)',
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          ticks: {
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
        },
        'co2-y-axis': {
          beginAtZero: true,
          suggestedMax: 3000,
          position: 'right',
          title: {
            display: true,
            text: 'CO2 (ppm)',
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          ticks: {
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        'c2h4-y-axis': {
          beginAtZero: true,
          suggestedMax: 100,
          position: 'right',
          title: {
            display: true,
            text: 'C2H4 (ppm)',
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          ticks: {
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        'humidity-y-axis': {
          beginAtZero: true,
          suggestedMax: 120,
          position: 'left',
          title: {
            display: true,
            text: 'Humidity %',
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          ticks: {
            color: fontColor,
            font: {
              size: fontSize,
            },
          },
          grid: {
            drawOnChartArea: true,
          },
        },
      },
    },
  });

  return chart;
};

export default chartSetup;
