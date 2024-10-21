import { Body, Controller, Get, Logger, LoggerService, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import { DoulingoService } from "src/doulingo/doulingo.service";

@Controller('users')
export class UserController {
  private readonly logger: LoggerService = new Logger(UserController.name, {timestamp: true});

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
    try {
      const users = ["Kuro146", "longvuit18", "thangtrinh220199", "tunali0907"]
      const result: Prisma.UserCreateInput[] = []
      for (const user of users) {
        const data = await this.doulingo.GetID(user);
        console.log(data.id);
        
        const m_user = {doulingo_id: String(data.id), username: data.username}
        result.push(m_user)
      }
      
      await this.userService.CreateMany(result)
    } catch (error) {
      this.logger.error(error);
    }
    
  }

  @Put()
  async UpdateDebt(@Body() body: {name: string, debt: number}) {
    try {
      let users = {
        "DTuan": "1170512027",
        "Vu": "1207989193",
        "Thang": "1339837511",
        "ATuan": "764052804"
      }
      
      await this.userService.Update(users[body.name], {debt: body.debt})
    } catch (error) {
      this.logger.error('Fail to update debt!', error)
    }
  }
}