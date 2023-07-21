import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LearnersResolver } from './learners.resolver';
import { LearnersService } from './learners.service';

@Module({
  imports: [AuthModule],
  providers: [LearnersService, LearnersResolver],
})
export class LearnersModule {}
