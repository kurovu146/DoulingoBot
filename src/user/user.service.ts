import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService
  ) {}

  async Create(data: User) {
    await this.prisma.user.create({
      data
    });
  }

  async CreateMany(data: Prisma.UserCreateInput[]) {
    await this.prisma.user.createMany({
      data
    });
  }

  async Update(doulingo_id: string, data: Prisma.UserUpdateWithoutExpsInput) {
    await this.prisma.user.update({
      where: {
        doulingo_id
      }, 
      data
    });
  }
}