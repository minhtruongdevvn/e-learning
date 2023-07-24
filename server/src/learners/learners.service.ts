import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/models/token.model';
import { PasswordService } from 'src/auth/password.service';
import { CreateLearnerInput } from './inputs/create-learner.input';
import { UpdateLearnerInput } from './inputs/update-learner.input';
import { Learner } from './models/learner.model';

@Injectable()
export class LearnersService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async exists(where: Prisma.LearnerWhereInput) {
    const subject = await this.prisma.learner.findFirst({
      where,
      select: { id: true },
    });

    return !!subject;
  }

  async create(data: CreateLearnerInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password
    );

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: Role.LEARNER,
        learner: {
          create: {},
        },
      },
    });

    return await this.authService.generateTokens(user);
  }

  async update(data: UpdateLearnerInput) {
    const { id, ...userInfo } = data;

    const { learner, ...user } = await this.prisma.user.update({
      where: { id },
      data: userInfo,
      include: { learner: true },
    });

    return { ...learner, ...user };
  }

  async delete(id: string): Promise<Learner> {
    const { learner, ...user } = await this.prisma.user.delete({
      where: { id },
      include: { learner: true },
    });

    return { ...learner, ...user };
  }
}
