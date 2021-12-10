import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema()
export class Url {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  shortUrl: string;

  @Prop({
    required: true,
  })
  longUrl: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  hash: string;

  @Prop({
    required: true,
    default: 0,
  })
  count: number;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
