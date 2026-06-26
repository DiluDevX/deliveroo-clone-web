export interface IDish {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  isPopular?: boolean | null;
  discountPercent?: number | null;
}

export interface ICategory {
  id: string;
  name: string;
  dishes?: IDish[];
}
