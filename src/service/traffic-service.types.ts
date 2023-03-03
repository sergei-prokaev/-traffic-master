export interface ITrafficResponse {
  id: number;
  type: string;
  brand: string;
  colors: string[];
  img: string;
}

export interface ITrafficService {
  fetchData(cb: (error: string | null, data?: ITrafficResponse[]) => void): void;
}
