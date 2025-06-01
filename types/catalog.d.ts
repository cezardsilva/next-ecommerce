import { IProduct } from "./product";

export interface ICatalog {
  id: number;
  localizeInfos?: {
    title?: string;
  };
  catalogProducts: {
    items: IProduct[];
  };
}