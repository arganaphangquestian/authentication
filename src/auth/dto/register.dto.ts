import { ApiProperty } from '@nestjs/swagger';

export class Register {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
