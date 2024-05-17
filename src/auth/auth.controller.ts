import { Body, Controller, Post } from '@nestjs/common';
import { Authservice } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class Authcontroller {
  constructor(private authService: Authservice) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log({ dto });

    return this.authService.signup(dto);
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
