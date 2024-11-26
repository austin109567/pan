export interface Layer {
  id: number;
  name: string;
  traits: {
    id: number;
    name: string;
    image: string;
  }[];
}