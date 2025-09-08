export interface MeterModel {
  name: string;
  values: string[];
}

export interface MeterData {
  date: string;
  models: MeterModel[];
}

export interface MeterFilter {
  meter: string;
  date: string;
}