import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlDto } from './dto/url.dto';
import { Url, UrlDocument } from './model/url.model';
import * as md5 from 'md5';

@Injectable()
export class UrlHashingSystemService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}
  public async saveUrl(urlObject: UrlDto): Promise<UrlDocument> {
    const urlDoc = new this.urlModel(urlObject);
    return await urlDoc.save();
  }
  public async saveCount(urlObject): Promise<UrlDocument> {
    const update = {
      $set: { count: urlObject.count + 1 },
    };
    return await this.urlModel.findOneAndUpdate(
      { _id: urlObject._id },
      update,
      { upsert: true },
    );
  }
  public async findLongUrl(shortUrl: string): Promise<UrlDocument | null> {
    const urlDoc = await this.urlModel.findOne({
      shortUrl,
    });
    return urlDoc;
  }

  public async checkIfExists(shortUrl: string): Promise<UrlDocument> {
    const updatedUrlDoc = await this.urlModel.findOne(
      {
        shortUrl,
      },
      'shortUrl',
    );
    return updatedUrlDoc;
  }

  public async findUrlWithHash(hash: string): Promise<UrlDocument> {
    return await this.urlModel.findOne({
      hash,
    });
  }
  public async findAll() {
    return await this.urlModel.find();
  }

  /**
   * The charset represents the possible characters which will be present in the
   * tiny url.
   */
  private readonly charset =
    '01234567879abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  private readonly charsetRegex = /^[a-zA-Z0-9]*$/;

  private readonly shortUrlLen = 7;

  private readonly urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

  /**
   * Utility function to get a character randomly picked from the charset.
   */
  private getRandomCharFromCharset() {
    const min = 0;
    const max = this.charset.length;
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.charset.charAt(randomIndex);
  }

  /**
   * Utility function to generate a random string of lenght len.
   * The string contains characters randomly picked from the charset.
   */
  private getShortUrl(): string {
    let randomStr = '';
    while (randomStr.length < this.shortUrlLen) {
      randomStr += this.getRandomCharFromCharset();
    }
    return randomStr;
  }

  public getHash(longUrl: string): string {
    return md5(longUrl, {
      asString: true,
    });
  }

  public isValidShortUrl(shortUrl: string): boolean {
    return (
      Object.prototype.toString.call(shortUrl) === '[object String]' &&
      shortUrl.length === 7 &&
      this.charsetRegex.test(shortUrl)
    );
  }

  public async getIfExists(hash: string): Promise<UrlDocument | null> {
    // This is one way to get around the tracking of accessing a short url.
    // Depending on what do we want to track, we can change this search to
    // be tracked as well. For now this is assumed to be left out.
    const existingUrlDoc = await this.findUrlWithHash(hash);
    return existingUrlDoc ? existingUrlDoc : null;
  }

  public async generateShortUrl(
    longUrl: string,
    hash: string,
    attempts = 0,
    counter?,
  ): Promise<UrlDocument> {
    return new Promise(async (resolve, reject) => {
      const shortUrl = this.getShortUrl();
      const count = counter ? counter : 0;
      try {
        const savedUrl: UrlDocument = await this.saveUrl({
          longUrl,
          shortUrl,
          hash,
          count,
        });
        return resolve(savedUrl);
      } catch (error) {
        // console.log('Possible Collision');
        if (error.code === 11000 && attempts < 3) {
          // mongo error due to collision
          // try to get a new short url
          try {
            const urlObj = await this.generateShortUrl(
              longUrl,
              hash,
              attempts + 1,
            );
            return resolve(urlObj);
          } catch (e) {
            return reject(e);
          }
        }
        return reject(error);
      }
    });
  }
}

// import base62 from 'base62';
// sample for another approach using the base62
// of the md5 hash of the url.
// function first43bits2(hashStr: string) {
//   let toConvertBits = '';
//   for (let i = 0; i <= 6; i++) {
//     const binary = hashStr.charCodeAt(i).toString(2);
//     toConvertBits += binary;
//   }
//   toConvertBits = toConvertBits.substr(0, 42);
//   const decimalNum = parseInt(toConvertBits, 2);
//   const base62Version = base62.encode(decimalNum);
// }
