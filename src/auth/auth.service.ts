import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      // Generate password hash
      const hash = await argon.hash(dto.password);
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName
        }
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
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
    // Delete hash and return user
    delete user.hash;
    return user;
  }
}
