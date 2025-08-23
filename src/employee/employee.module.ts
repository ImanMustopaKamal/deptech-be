import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [EmployeeService],
  controllers: [EmployeeController]
})
export class EmployeeModule {}
