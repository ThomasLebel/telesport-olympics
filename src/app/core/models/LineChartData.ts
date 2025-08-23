export interface LineChartData {
  name: string;
  series: SerieChartData[];
}

export interface SerieChartData {
  name: string;
  value: number;
}
