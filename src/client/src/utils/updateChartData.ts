import Chart from 'chart.js/auto';
import { SensorData, ImageData, ChartDataset } from '../types';

const updateChartData = (chart: Chart<'line', (number | null)[], unknown>, sensorData: SensorData) => {
  const { ts, temperature, co2, c2h4, humidity } = sensorData;

  const formattedTime = ts.substring(11, 19);

  const maxDataPoints = 60;
  const labels = chart.data.labels as (Date | string)[];
  const datasets = chart.data.datasets as ChartDataset[];

  if (labels.length === maxDataPoints) {
    labels.shift();
    datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  labels.push(formattedTime);
  datasets[0].data.push(temperature);
  datasets[1].data.push(co2);
  datasets[2].data.push(c2h4);
  datasets[3].data.push(humidity);

  chart.update();
};

const updateImageData = (imageData: ImageData) => {
  const { ts, image, node } = imageData;
  const formattedTime = ts.substring(11, 19);

  const imageCard = document.getElementById(`image-${node}`) as HTMLDivElement;
  const timeText = imageCard.querySelector('.time') as HTMLParagraphElement;
  const imageText = imageCard.querySelector('.image') as HTMLParagraphElement;

  timeText.textContent = '';
  timeText.textContent = `Time: ${formattedTime}`;

  imageText.textContent = '';
  imageText.textContent = `Image: ${image}`;
};

export default {
  updateChartData,
  updateImageData,
};
