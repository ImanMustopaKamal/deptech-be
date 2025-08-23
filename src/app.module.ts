import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { EmployeeModule } from './employee/employee.module';
import { LeaveModule } from './leave/leave.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AdminModule,
    EmployeeModule,
    LeaveModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
