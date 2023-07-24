import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/models/token.model';
import { PasswordService } from 'src/auth/password.service';
import { CreateLecturerInput } from './inputs/create-lecturer.input';
import { UpdateLecturerInput } from './inputs/update-lecturer.input';
import { Lecturer } from './models/lecturer.model';

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

    return await this.authService.generateTokens(user);
  }

  async update(data: UpdateLecturerInput) {
    const { department, about, id, ...userInfo } = data;

    const { lecturer, ...user } = await this.prisma.user.update({
      where: { id },
      data: { ...userInfo, lecturer: { update: { department, about } } },
      include: { lecturer: true },
    });

    return { ...lecturer, ...user };
  }

  async exists(where: Prisma.LearnerWhereInput) {
    const subject = await this.prisma.lecturer.findFirst({
      where,
      select: { id: true },
    });

    return !!subject;
  }

  async delete(id: string): Promise<Lecturer> {
    const { lecturer, ...user } = await this.prisma.user.delete({
      where: { id },
      include: { lecturer: { select: { about: true, department: true } } },
    });

    return { ...user, ...lecturer };
  }
}
