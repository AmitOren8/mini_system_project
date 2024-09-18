import io from 'socket.io-client';
import Chart from 'chart.js/auto';
import chartSetup from './utils/chartSetup';
import dataUtils from './utils/updateChartData';
import { Device, SensorData, ImageData } from './types';

document.addEventListener('DOMContentLoaded', async () => {
  const socket = io('http://localhost:9090');
  const charts: Map<string, Chart<'line', (number | null)[], unknown>> = new Map();

  try {
    const response = await fetch(`http://localhost:9090/device/list`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const devices: Device[] = await response.json();

    const dropdownContent = document.querySelector('.dropdown-content') as HTMLDivElement;
    const devicePanelsContainer = document.getElementById('device-panels-container') as HTMLDivElement;

    if (dropdownContent) {
      dropdownContent.innerHTML = '';

      // Create device panels for each device
      devices.forEach((device: Device) => {
        if (device.nodeID) {
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = device.nodeID;
          dropdownContent.appendChild(a);

          const devicePanel = document.createElement('div');
          devicePanel.classList.add('device-panel');
          devicePanel.id = `device-panel-${device.nodeID}`;
          devicePanel.style.display = 'none';

          devicePanel.innerHTML = `
            <div class="panel-header">
              <h2 class="device-name">${device.nodeID}</h2>
              <div class="controls">
                <button class="start-btn" data-node-id="${device.nodeID}">Start</button>
                <button class="stop-btn" data-node-id="${device.nodeID}">Stop</button>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="plot-${device.nodeID}" class="chart"></canvas>
            </div>
            <div id="image-${device.nodeID}"  class="image-card">
              <h4>Latest Image</h4>
              <p class="time"></p>
              <p class="image"></p>
            </div>
          `;

          devicePanelsContainer.appendChild(devicePanel);

          // Create and save chart for the device
          const chart = chartSetup(device.nodeID);
          charts.set(device.nodeID, chart);

          // Create event listeners for Start and Stop buttons for each device
          const startBtn = devicePanel.querySelector('.start-btn') as HTMLButtonElement;
          const stopBtn = devicePanel.querySelector('.stop-btn') as HTMLButtonElement;

          startBtn.addEventListener('click', async () => {
            const nodeID = startBtn.getAttribute('data-node-id');
            if (startBtn.classList.contains('inactive')) return;

            try {
              const startResponse = await fetch(`http://localhost:9090/device/${nodeID}/start`, {
                method: 'POST',
              });

              if (!startResponse.ok) throw new Error(`HTTP error! status: ${startResponse.status}`);

              startBtn.classList.add('inactive');
              stopBtn.classList.remove('inactive');
            } catch (error) {
              console.error('Error starting device:', error);
            }
          });

          stopBtn.addEventListener('click', async () => {
            const nodeID = stopBtn.getAttribute('data-node-id');
            if (stopBtn.classList.contains('inactive')) return;

            try {
              const stopResponse = await fetch(`http://localhost:9090/device/${nodeID}/stop`, {
                method: 'POST',
              });

              if (!stopResponse.ok) throw new Error(`HTTP error! status: ${stopResponse.status}`);

              startBtn.classList.remove('inactive');
              stopBtn.classList.add('inactive');
            } catch (error) {
              console.error('Error stopping device:', error);
            }
          });
        }
      });

      // Add event listeners to the dropdown links
      const dropdownLinks = dropdownContent.querySelectorAll('a');
      dropdownLinks.forEach((link, index) => {
        const device = devices[index];

        link.addEventListener('click', async () => {
          const devicePanel = document.getElementById(`device-panel-${device.nodeID}`) as HTMLDivElement;

          try {
            // Send GET request to fetch device info
            const response = await fetch(`http://localhost:9090/device/${device.nodeID}/info`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const deviceInfo = await response.json();
            const { active } = deviceInfo; // Assuming the response contains 'active' field

            // Hide all panels
            const allPanels = document.querySelectorAll('.device-panel') as NodeListOf<HTMLDivElement>;
            allPanels.forEach((panel) => (panel.style.display = 'none'));

            // Show the selected device panel
            devicePanel.style.display = 'block';

            // Get the Start and Stop buttons for the selected device
            const startBtn = devicePanel.querySelector('.start-btn') as HTMLButtonElement;
            const stopBtn = devicePanel.querySelector('.stop-btn') as HTMLButtonElement;

            // Update button states based on device.active
            if (active) {
              startBtn.classList.add('inactive');
              stopBtn.classList.remove('inactive');
            } else {
              startBtn.classList.remove('inactive');
              stopBtn.classList.add('inactive');
            }
          } catch (error) {
            console.error('Error fetching device info:', error);
          }
        });
      });
    }

    socket.on('sensorData', (sensorData: SensorData) => {
      const chart = charts.get(sensorData.node);
      if (chart) {
        dataUtils.updateChartData(chart, sensorData);
      }
    });

    socket.on('imageData', (imageData: ImageData) => {
      dataUtils.updateImageData(imageData);
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
});
