export interface AgriData {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': number;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': number;
  'Area Under Cultivation (UOM:Ha(Hectares))': number;
}
export interface TableData {
  year: string;
  maxCrop: string;
  minCrop: string;
}

export interface AgriTableProps {
  data: AgriData[];
}