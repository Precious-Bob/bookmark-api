import { Module } from "@nestjs/common";
import { Authcontroller } from "./auth.controller";
import { Authservice } from "./auth.service";

@Module({
  controllers: [Authcontroller],
  providers: [Authservice]
})
export class AuthModule{}