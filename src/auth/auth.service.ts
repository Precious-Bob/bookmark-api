import { Injectable } from '@nestjs/common';

@Injectable({})
export class Authservice {
  signup() {
    return 'i have signed up';
  }
  signin() {
    return 'i have signed in';
  }
}
