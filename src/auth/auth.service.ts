import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class Authservice {
  constructor(private prisma: PrismaService) {}
  signup(dto: AuthDto) {
    return { msg: 'i have signed up' };
  }
  signin() {
    return { msg: 'i have signed in' };
  }
}
