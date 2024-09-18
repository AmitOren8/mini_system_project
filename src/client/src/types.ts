export type Device = {
  _id: string;
  nodeID: string;
  location: string;
  active: boolean;
};

export type SensorData = {
  ts: string;
  temperature: number;
  co2: number;
  c2h4: number;
  humidity: number;
  node: string;
};

export type ImageData = {
  ts: string;
  image: string;
  node: string;
};

export type ChartDataset = {
  data: (number | null)[];
};
