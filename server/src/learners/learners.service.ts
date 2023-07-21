import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/models/token.model';
import { PasswordService } from 'src/auth/password.service';
import { CreateLearnerInput } from './inputs/create-learner.input';
import { UpdateLearnerInput } from './inputs/update-learner.input';

@Injectable()
export class LearnersService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async create(data: CreateLearnerInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password
    );

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: Role.LEARNER,
        Learner: {
          create: {},
        },
      },
    });

    return this.authService.generateTokens({ userId: user.id });
  }

  update(data: UpdateLearnerInput) {
    const { id, ...userInfo } = data;

    return this.prisma.user.update({
      where: { id },
      data: userInfo,
      include: { lecturer: true },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
