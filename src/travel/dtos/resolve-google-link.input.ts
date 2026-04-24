import { IsString, IsUrl } from 'class-validator';

export class ResolveGoogleLinkInput {
  @IsString()
  @IsUrl()
  url!: string;
}
