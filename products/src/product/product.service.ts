import { Injectable } from '@nestjs/common';
import { products } from '../seed/products';

export interface IProduct {
  id: string;
  Name: string;
  Price: string;
  Description: string;
  Category: string;
  Type: string;
  Image: string;
  Manufacturer: string;
  Seller: string;
  Quantity: number;
  Tax: number;
}

@Injectable()
export class ProductService {
  getAllProducts = (): IProduct[] => {
    return products;
  };

  getSingleProduct(id: string): IProduct {
    return products.find((product) => product.id === id);
  }
}
