import { Injectable, NotFoundException } from '@nestjs/common';
import { CartCache } from './cart.cache';
import { Cart, Product } from './cart.model';
import { products } from '../seed/products';

@Injectable()
export class CartService {
  private readonly cartCache: CartCache;

  constructor() {
    this.cartCache = new CartCache();
  }

  private getProduct = (productId: string): Product => {
    const product = products.find((product) => product.id === productId);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return { details: product, totalQuantity: 0, price: product.Price };
  };

  public getCart = (userId: string) => {
    return Cart.getCart(userId);
  };

  public createCart = (userId: string): Cart => {
    return new Cart(userId);
  };

  public addToCart = (userId: string, productId: string): Cart => {
    const cart = Cart.getCart(userId);
    const product = this.getProduct(productId);

    cart.addToCart(product);

    return cart;
  };

  public removeSingleQuantityFromCart = (userId: string, productId: string) => {
    const cart = Cart.getCart(userId);
    const product = this.getProduct(productId);

    cart.removeFromCart(product);
  };

  public removeAllQuantityFromCart = (userId: string, productId: string) => {
    const cart = Cart.getCart(userId);
    const product = this.getProduct(productId);

    cart.removeAllQuantityFromCart(product);
  };
}
