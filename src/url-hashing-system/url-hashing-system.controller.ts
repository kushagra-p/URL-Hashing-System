import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Render,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { ResDto } from './dto/response.dto';
import { UrlDto } from './dto/url.dto';
import { IUrlResponse } from './interface/url.response.interface';
import { UrlDocument } from './model/url.model';
import { UrlHashingSystemService } from './url-hashing-system.service';

@Controller('')
@ApiTags('URL Hashing')
export class UrlHashingSystemController {
  constructor(private urlSvc: UrlHashingSystemService) {}

  /**
   * A handler reponsible for returning a short url for a given long url.
   * Additionally a short url can also be given by the user.
   *
   * Checks if the same long url is already present with a short url.
   * If yes, returns the short url for the long url.
   * If not, attempts to accept the short url given by the user.
   *
   */
  @Post('url')
  @ApiResponse({
    status: 201,
    description: 'Record inserted',
    type: ResDto,
  })
  async createTinyUrl(
    @Body(new ValidationPipe()) body: UrlDto,
    @Req() req,
  ): Promise<IUrlResponse> {
    const { shortUrl, longUrl, count } = body;
    const baseUrl = req.protocol + '://' + req.headers.host;
    const hash = this.urlSvc.getHash(longUrl);
    const existingTinyUrl = await this.urlSvc.getIfExists(hash);

    if (existingTinyUrl) {
      return {
        longUrl,
        shortUrl: `${baseUrl}/${existingTinyUrl.shortUrl}`,
        count: existingTinyUrl.count,
      };
    }

    if (isEmpty(shortUrl)) {
      const urlDoc: UrlDocument = await this.urlSvc.generateShortUrl(
        longUrl,
        hash,
        0,
      );
      return {
        longUrl,
        shortUrl: `${baseUrl}/${urlDoc.shortUrl}`,
        count: urlDoc.count,
      };
    } else {
      try {
        // it is important to attempt a save here.
        // to get a collision in case of duplicate generation.
        const savedUrl: UrlDocument = await this.urlSvc.saveUrl({
          longUrl,
          shortUrl,
          hash,
          count,
        });

        return {
          longUrl,
          shortUrl: `${baseUrl}/${savedUrl.shortUrl}`,
          count: savedUrl.count,
        };
      } catch (error) {
        if (error.code === 11000) {
          // possible security issue, once can make attempts to guess the
          // short urls in use.
          throw new BadRequestException({
            details: {
              message: 'The short url is already taken',
            },
          });
        }
      }
    }
  }

  @Get('url/:shortUrl')
  @ApiResponse({
    status: 200,
    description: 'Record Fetched',
    type: ResDto,
  })
  async getLongUrl(
    @Param('shortUrl') shortUrl: string,
    @Req() req,
  ): Promise<IUrlResponse> {
    const baseUrl = req.protocol + '://' + req.headers.host;

    if (!this.urlSvc.isValidShortUrl(shortUrl)) {
      throw new BadRequestException({
        response: {
          message: 'Bad Request. Specify a valid short url',
        },
      });
    }

    const savedUrl: UrlDocument = await this.urlSvc.findLongUrl(shortUrl);

    if (savedUrl) {
      return {
        longUrl: savedUrl.longUrl,
        shortUrl: `${baseUrl}/${savedUrl.shortUrl}`,
        count: savedUrl.count,
      };
    } else {
      throw new NotFoundException({
        response: {
          message: 'No record found with the given short url',
        },
      });
    }
  }
  @Get('url/get-all')
  @ApiResponse({
    status: 200,
    description: 'Record Fetched',
    type: [ResDto],
  })
  async getAll() {
    let res = await this.urlSvc.findAll();
    return res;
  }
  @Get(':shortUrl')
  @ApiResponse({
    status: 200,
    description: 'Redirect to Long-url',
  })
  @Redirect()
  async redirectToLongUrl(@Param('shortUrl') shortUrl: string): Promise<any> {
    if (!this.urlSvc.isValidShortUrl(shortUrl)) {
      throw new BadRequestException({
        response: {
          message: 'Bad Request. Specify a valid short url',
        },
      });
    }

    const savedUrl: UrlDocument = await this.urlSvc.findLongUrl(shortUrl);
    await this.urlSvc.saveCount(savedUrl);
    if (savedUrl) {
      return { url: savedUrl.longUrl };
    }
  }

  @Get('view/dashboard')
  @ApiResponse({
    status: 200,
    description: 'Redirect to UI view',
  })
  @Render('index.ejs')
  async root() {
    let res = await this.urlSvc.findAll();
    return { message: 'Hello world!' };
  }
}
