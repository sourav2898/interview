import { Cart } from './cart.model';
import { ConflictException } from '@nestjs/common';

interface Carts {
  [key: string]: Cart;
}

export class CartCache {
  private carts: Carts;

  constructor() {
    this.carts = {};
  }

  public addToCache = (userId: string, cart: Cart) => {
    const previousCart = this.getCart(userId);
    if (previousCart) {
      throw new ConflictException('cart is already created for existing user');
    }

    this.carts = { ...this.carts, [userId]: cart };
  };

  public getCart = (userId: string): Cart | undefined => {
    return this.carts[userId];
  };

  public updateCache = (userId: string, cart: Cart) => {
    this.carts[userId] = cart;
  };
}

export const cartCache = new CartCache();
