import { ForbiddenException, Injectable } from '@nestjs/common';
import { SigninDto, signupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: signupDto) {
    try {
      const { email, firstName, lastName, password } = dto;
      // Generate password hash
      const hash = await argon.hash(password);
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
          firstName,
          lastName
        }
      });
      return this.signToken(user.id, user.email); // Jwt stuff
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signin(dto: SigninDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });
    // If user doesn't exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // If password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET')
    });

    return {
      access_token: token
    };
  }
}
// Note: since we're returning a promise(this.signAysnc), we don't need to put async beside the signToken. it'll only be useful if we're doing some asynchronous opperation with await. (update: this doesn't apply to this case again)

