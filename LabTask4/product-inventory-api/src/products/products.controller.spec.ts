import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    create: jest.fn<() => Promise<unknown>>(),
    findAll: jest.fn<() => Promise<unknown>>(),
    findOne: jest.fn<() => Promise<unknown>>(),
    update: jest.fn<() => Promise<unknown>>(),
    replace: jest.fn<() => Promise<unknown>>(),
    remove: jest.fn<() => Promise<unknown>>(),
    findByCategory: jest.fn<() => Promise<unknown>>(),
    search: jest.fn<() => Promise<unknown>>(),
    toggleActive: jest.fn<() => Promise<unknown>>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create()', async () => {
    const dto = {
      name: 'iPhone 15',
      price: 999.99,
      category: 'Electronics',
    };

    mockProductsService.create.mockResolvedValue({
      message: 'Product created successfully',
    });

    await controller.create(dto);

    expect(mockProductsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll()', async () => {
    mockProductsService.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(mockProductsService.findAll).toHaveBeenCalled();
  });

  it('should call findOne() with ID', async () => {
    mockProductsService.findOne.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call update()', async () => {
    const dto = { price: 899.99 };

    await controller.update(1, dto);

    expect(mockProductsService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call replace()', async () => {
    const dto = {
      name: 'iPhone 15 Pro',
      price: 1099.99,
      category: 'Electronics',
    };

    await controller.replace(1, dto);

    expect(mockProductsService.replace).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove()', async () => {
    await controller.remove(1);

    expect(mockProductsService.remove).toHaveBeenCalledWith(1);
  });

  it('should call findByCategory()', async () => {
    await controller.findByCategory('Electronics');

    expect(mockProductsService.findByCategory).toHaveBeenCalledWith(
      'Electronics',
    );
  });

  it('should call search()', async () => {
    await controller.search('phone');

    expect(mockProductsService.search).toHaveBeenCalledWith('phone');
  });

  it('should call toggleActive()', async () => {
    await controller.toggleActive(1);

    expect(mockProductsService.toggleActive).toHaveBeenCalledWith(1);
  });
});
