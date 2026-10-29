import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { Products } from './entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  const product: Products = {
    id: 1,
    name: 'iPhone 15',
    description: 'Apple smartphone',
    price: 999.99,
    stock: 50,
    category: 'Electronics',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn<(dto: CreateProductDto) => Products>(),
    save: jest.fn<(item: Products) => Promise<Products>>(),
    find: jest.fn<() => Promise<Products[]>>(),
    findOne: jest.fn<() => Promise<Products | null>>(),
    delete: jest.fn<() => Promise<{ affected: number }>>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = {
      name: 'iPhone 15',
      price: 999.99,
      category: 'Electronics',
    };

    mockRepository.create.mockReturnValue(product);
    mockRepository.save.mockResolvedValue(product);

    const result = await service.create(dto);

    expect(result.data).toEqual(product);
    expect(mockRepository.save).toHaveBeenCalledWith(product);
  });

  it('should fetch all products', async () => {
    mockRepository.find.mockResolvedValue([product]);

    const result = await service.findAll();

    expect(result.count).toBe(1);
    expect(result.data).toEqual([product]);
    expect(mockRepository.find).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
    });
  });

  it('should fetch a product by ID', async () => {
    mockRepository.findOne.mockResolvedValue(product);

    const result = await service.findOne(1);

    expect(result.data).toEqual(product);
  });

  it('should return 404 when product is missing', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should partially update a product', async () => {
    mockRepository.findOne.mockResolvedValue({ ...product });

    mockRepository.save.mockImplementation((item: Products) =>
      Promise.resolve(item),
    );

    const result = await service.update(1, {
      price: 899.99,
      stock: 45,
    });

    expect(result.data.price).toBe(899.99);
    expect(result.data.stock).toBe(45);
  });

  it('should replace a product', async () => {
    mockRepository.findOne.mockResolvedValue({ ...product });

    mockRepository.save.mockImplementation((item: Products) =>
      Promise.resolve(item),
    );

    const result = await service.replace(1, {
      name: 'iPhone 15 Pro',
      price: 1099.99,
      category: 'Electronics',
    });

    expect(result.data.name).toBe('iPhone 15 Pro');
    expect(result.data.price).toBe(1099.99);
    expect(result.data.stock).toBe(0);
  });

  it('should delete a product', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);

    expect(result.id).toBe(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should return 404 when deleting a missing product', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should filter products by category', async () => {
    mockRepository.find.mockResolvedValue([product]);

    const result = await service.findByCategory('Electronics');

    expect(result.count).toBe(1);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { category: 'Electronics' },
    });
  });

  it('should search products by name', async () => {
    mockRepository.find.mockResolvedValue([product]);

    const result = await service.search('phone');

    expect(result.count).toBe(1);
    expect(result.data).toEqual([product]);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should toggle product active status', async () => {
    mockRepository.findOne.mockResolvedValue({ ...product });

    mockRepository.save.mockImplementation((item: Products) =>
      Promise.resolve(item),
    );

    const result = await service.toggleActive(1);

    expect(result.data.isActive).toBe(false);
  });
});
