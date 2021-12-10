import { Test, TestingModule } from '@nestjs/testing';
import { UrlHashingSystemService } from './url-hashing-system.service';

describe('UrlHashingSystemService', () => {
  let service: UrlHashingSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlHashingSystemService],
    }).compile();

    service = module.get<UrlHashingSystemService>(UrlHashingSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
