import { cartCache } from './cart.cache';
import { v4 as uuid } from 'uuid';
import { NotFoundException } from '@nestjs/common';

export interface Product {
  details: {
    id: string;
    Name: string;
    Price: number;
    Description: string;
    Category: string;
    Type: string;
    Image: string;
    Manufacturer: string;
    Seller: string;
    Quantity: number;
    Tax: number;
  };
  price: number;
  totalQuantity: number;
}

export class Cart {
  private readonly cartId: string;
  private readonly userId: string;
  private products: Product[];
  private totalPrice: number;
  private totalQuantity: number;

  constructor(userId: string) {
    this.cartId = uuid();
    this.userId = userId;
    this.products = [];
    this.totalPrice = 0;
    this.totalQuantity = 0;
    cartCache.addToCache(this.userId, this);
  }

  private getProduct = (productId: string): Product | undefined => {
    return this.products.find((product) => product.details.id === productId);
  };

  static getCart = (userId: string): Cart => {
    const cart = cartCache.getCart(userId);
    if (!cart) {
      throw new NotFoundException('cart not found');
    }

    return cart;
  };

  public addToCart = (product: Product) => {
    this.totalPrice += product.details.Price;
    ++this.totalQuantity;

    if (!this.getProduct(product.details.id)) {
      this.products.push(product);
    }

    this.products = this.products.map((cartProduct) => {
      if (cartProduct.details.id === product.details.id) {
        ++cartProduct.totalQuantity;
      }
      return cartProduct;
    });

    cartCache.updateCache(this.userId, this);
  };

  // Removes single quantity from cart
  public removeFromCart = (product: Product) => {
    const cartProduct = this.getProduct(product.details.id);

    if (!cartProduct) {
      throw new NotFoundException('product is not added to cart');
    }

    if (cartProduct.totalQuantity === 1) {
      this.products = this.products.filter(
        (cartProduct) => cartProduct.details.id !== product.details.id,
      );
    } else {
      this.products = this.products.map((product) => {
        if (cartProduct.details.id === product.details.id) {
          --product.totalQuantity;
        }

        return product;
      });
    }

    this.totalPrice -= product.details.Price;
    --this.totalQuantity;

    cartCache.updateCache(this.userId, this);
  };

  // Removes all quantity from cart
  public removeAllQuantityFromCart = (product: Product) => {
    const cartProduct = this.getProduct(product.details.id);

    if (!cartProduct) {
      throw new NotFoundException('product is not added to cart');
    }

    this.totalPrice -= product.details.Price * cartProduct.totalQuantity;
    this.totalQuantity -= cartProduct.totalQuantity;

    this.products = this.products.filter(
      (cartProduct) => cartProduct.details.id !== product.details.id,
    );

    cartCache.updateCache(this.userId, this);
  };
}
