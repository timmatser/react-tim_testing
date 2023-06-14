export type ProductList = {
  id: number;
  title: string;
  fulltitle: string;
  image: ProductImage;
};

export type ProductImage = {
  createdAt: string;
  updatedAt: string;
  extension: string;
  size: number;
  title: string;
  thumb: string;
  src: string;
};

export type ProductDetail = {
  id: number;
  title: string;
  type: string;
  status: boolean;
  fulltitle: string;
  images: string[];
};

export type ProductImages = {
  id: number;
  sortOrder: number;
  src: string;
  title: string;
  thumb: string;
};

export type ProductItems = {
  id: number;
  title: string;
  type: string;
  sku: string;
  priceIncl: number;
  oldPriceIncl: number;
  stockLevel: string;
};

export type ProductVariants = {
  variants: IProductVariant[];
};

export type IProductVariant = {
  id: number;
  title: string;
  stockLevel: number;
  sortOrder: number;
};
