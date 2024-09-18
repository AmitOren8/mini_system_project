type IMqttDataPayload = {
    ts: Date;
    [key: string]: Date | string | number;
    node: string;
};

export default IMqttDataPayload;
