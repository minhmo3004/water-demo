export type DetailData = {
  id: number,
  name: string,
  timeStamp: Date,
  flow: number,
  prediction: number,
  predConfidence: number,
}

export enum PredictionClass {
  NORMAL = 0,
  ANOMALY = 1
}
