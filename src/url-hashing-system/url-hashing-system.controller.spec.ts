import { Test, TestingModule } from '@nestjs/testing';
import { UrlHashingSystemController } from './url-hashing-system.controller';

describe('UrlHashingSystemController', () => {
  let controller: UrlHashingSystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlHashingSystemController],
    }).compile();

    controller = module.get<UrlHashingSystemController>(
      UrlHashingSystemController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
