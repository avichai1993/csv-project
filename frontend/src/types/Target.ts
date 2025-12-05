export interface Target {
  id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  frequency: number;
  speed: number;
  bearing: number;
  ip_address: string;
}

export interface TargetFormData {
  latitude: string;
  longitude: string;
  altitude: string;
  frequency: string;
  speed: string;
  bearing: string;
  ip_address: string;
}

export const FREQUENCY_OPTIONS = [433, 915, 2.4, 5.2, 5.8];

export const emptyFormData: TargetFormData = {
  latitude: '',
  longitude: '',
  altitude: '',
  frequency: '2.4',
  speed: '',
  bearing: '',
  ip_address: '',
};
