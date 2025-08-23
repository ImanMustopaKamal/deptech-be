import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [LeaveService],
  controllers: [LeaveController]
})
export class LeaveModule {}
