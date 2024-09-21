import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "../../prisma/prisma.service";
import axios from "axios";
import { Prisma, User } from "@prisma/client";
import { DoulingoService } from "src/doulingo/doulingo.service";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly doulingo: DoulingoService
  ) {}

  @Get()
  async GetAllUser(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  @Post()
  async CreateMember() {
    const users = ["Kuro146", "longvuit18", "thangthuy9900", "tunali0907"]
    const result: Prisma.UserCreateInput[] = []
    for (const user of users) {
      const data = await this.doulingo.GetID(user)
      const m_user = {doulingo_id: String(data.id), username: data.username}
      result.push(m_user)
    }
    
    await this.userService.CreateMany(result)
  }

  @Put()
  async UpdateDebt(@Body() body: {doulingo_id: string, debt: number}) {
    await this.userService.Update(body.doulingo_id, {debt: body.debt})
  }

  
}