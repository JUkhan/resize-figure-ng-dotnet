export interface Figure {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface AppState {
  data: Figure[];
}
