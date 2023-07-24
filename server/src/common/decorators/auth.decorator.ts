import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

export const AuthGuard = () => UseGuards(GqlAuthGuard);
export const AuthGuardWithRole = () => UseGuards(GqlAuthGuard, RolesGuard);
