import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "../../prisma/prisma.service";
import { DoulingoService } from "src/doulingo/doulingo.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, DoulingoService],
})
export class UserModule {}