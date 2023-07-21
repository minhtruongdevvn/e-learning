import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LecturersResolver } from './lecturers.resolver';
import { LecturersService } from './lecturers.service';

@Module({
  providers: [LecturersService, LecturersResolver],
  imports: [AuthModule],
})
export class LecturersModule {}
