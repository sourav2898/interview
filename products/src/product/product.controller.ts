import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { IProduct, ProductService } from './product.service';

@Controller('/api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Array<IProduct> {
    return this.productService.getAllProducts();
  }

  @Get('/:id')
  getSingleProduct(@Param('id') id: string): IProduct {
    const product = this.productService.getSingleProduct(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }
}
