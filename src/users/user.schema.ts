import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt as Date fields
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  birthDate: string; // Kept as string per your type (ISO YYYY-MM-DD)

  @Prop({ type: { emails: [String], phones: [String] }, required: true })
  contact: {
    emails: string[];
    phones: string[];
  };

  @Prop({
    type: {
      facebook: String,
      instagram: String,
      linkedIn: String,
      twitter: String,
    },
  })
  socialNetworks: {
    facebook?: string;
    instagram?: string;
    linkedIn?: string;
    twitter?: string;
  };

  @Prop()
  profilePhoto?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    type: [String],
    enum: ['user', 'admin', 'moderator'],
    required: true,
  })
  roles: ('user' | 'admin' | 'moderator')[];

  @Prop({ enum: ['active', 'suspended', 'deleted'], required: true })
  status: 'active' | 'suspended' | 'deleted';

  @Prop()
  lastLogin?: Date; // Stored as Date, can be converted to ISO string when returned

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @Prop({ type: { latitude: Number, longitude: Number } })
  geoLocation?: {
    latitude: number;
    longitude: number;
  };

  @Prop({ enum: ['male', 'female', 'non-binary', 'other'] })
  gender?: 'male' | 'female' | 'non-binary' | 'other';

  @Prop()
  occupation?: string;

  @Prop()
  company?: string;

  @Prop()
  bio?: string;

  @Prop([String])
  interests?: string[];

  @Prop({
    type: {
      language: String,
      theme: { type: String, enum: ['light', 'dark'] },
      notifications: { email: Boolean, sms: Boolean, push: Boolean },
    },
  })
  preferences?: {
    language: string;
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  @Prop([String])
  friends?: string[]; // Array of user IDs as strings

  @Prop({ default: 0 })
  followersCount?: number;

  @Prop({ default: 0 })
  followingCount?: number;

  @Prop({ default: 0 })
  postsCount?: number;

  @Prop([String])
  badges?: string[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  twoFactorAuthEnabled: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
