export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  material: string;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  material: string;
  isFeatured: boolean;
  categoryId: number;
}

export interface UpdateProductDto extends CreateProductDto {
  isActive: boolean;
}
