import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/models/token.model';
import { PasswordService } from 'src/auth/password.service';
import { CreateLecturerInput } from './inputs/create-lecturer.input';
import { UpdateLecturerInput } from './inputs/update-lecturer.input';

@Injectable()
export class LecturersService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async create(data: CreateLecturerInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password
    );

    const { department, about, ...userInfo } = data;

    const user = await this.prisma.user.create({
      data: {
        ...userInfo,
        password: hashedPassword,
        role: Role.LECTURER,
        lecturer: {
          create: { about, department },
        },
      },
    });

    return this.authService.generateTokens({ userId: user.id });
  }

  update(data: UpdateLecturerInput) {
    const { department, about, id, ...userInfo } = data;

    return this.prisma.user.update({
      where: { id },
      data: { ...userInfo, lecturer: { update: { department, about } } },
      include: { lecturer: true },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
