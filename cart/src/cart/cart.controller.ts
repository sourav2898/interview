import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('users/:userId/cart')
  createCart(@Param('userId') userId: string): Cart {
    return this.cartService.createCart(userId);
  }

  @Get('users/:userId/cart')
  getCart(@Param('userId') userId: string): Cart {
    const cart = this.cartService.getCart(userId);
    if (!cart) {
      throw new NotFoundException('cart not found');
    }

    return cart;
  }

  @Put('users/:userId/cart/add-to-cart/:productId')
  addToCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Cart {
    const cart = this.cartService.addToCart(userId, productId);
    if (!cart) {
      throw new NotFoundException('cart not found');
    }

    return cart;
  }

  @Delete('users/:userId/cart/add-to-cart/:productId')
  removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Query('all') all: string,
  ) {
    if (all === 'true') {
      this.cartService.removeAllQuantityFromCart(userId, productId);
      return;
    }
    this.cartService.removeSingleQuantityFromCart(userId, productId);
  }
}
