import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { LeaveResponseDto } from './dto/response-leave.dto';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { EmployeeWithLeavesDto } from './dto/employee-with-leaves.dto';
import { ResponseEmployeeDto } from 'src/employee/dto/response-employee.dto';
import { Gender } from 'src/employee/dto/create-employee.dto';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  private toLeaveResponse(leave: any): LeaveResponseDto {
    return new LeaveResponseDto({
      id: leave.id,
      reason: leave.reason,
      startDate: leave.startDate,
      endDate: leave.endDate,
      employeeId: leave.employeeId,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
    });
  }

  private calculateLeaveDays(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  private isSameMonth(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  }

  async validateLeaveConstraints(
    employeeId: number,
    startDate: Date,
    endDate: Date,
    excludeLeaveId?: number,
  ): Promise<void> {
    const leaveDays = this.calculateLeaveDays(startDate, endDate);

    // Validasi 1: Maksimal 12 hari cuti dalam 1 tahun
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const yearlyLeaves = await this.prisma.leave.findMany({
      where: {
        employeeId,
        startDate: { gte: yearStart },
        endDate: { lte: yearEnd },
        NOT: excludeLeaveId ? { id: excludeLeaveId } : undefined,
      },
    });

    const totalYearlyLeaveDays = yearlyLeaves.reduce((total, leave) => {
      return total + this.calculateLeaveDays(leave.startDate, leave.endDate);
    }, 0);

    if (totalYearlyLeaveDays + leaveDays > 12) {
      throw new BadRequestException(
        'Employee cannot exceed 12 leave days per year',
      );
    }

    // Validasi 2: Hanya 1 hari cuti per bulan
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();

    const monthlyLeaves = await this.prisma.leave.findMany({
      where: {
        employeeId,
        OR: [
          {
            startDate: {
              gte: new Date(startYear, startMonth, 1),
              lte: new Date(startYear, startMonth + 1, 0),
            },
          },
          {
            endDate: {
              gte: new Date(startYear, startMonth, 1),
              lte: new Date(startYear, startMonth + 1, 0),
            },
          },
        ],
        NOT: excludeLeaveId ? { id: excludeLeaveId } : undefined,
      },
    });

    if (monthlyLeaves.length > 0) {
      throw new BadRequestException(
        'Employee can only take 1 leave day per month',
      );
    }
  }

  async create(
    createLeaveDto: CreateLeaveDto,
  ): Promise<SuccessResponseDto<LeaveResponseDto>> {
    const startDate = new Date(createLeaveDto.startDate);
    const endDate = new Date(createLeaveDto.endDate);

    // Validasi tanggal
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Check if employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: createLeaveDto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createLeaveDto.employeeId} not found`,
      );
    }

    // Validasi constraints
    await this.validateLeaveConstraints(
      createLeaveDto.employeeId,
      startDate,
      endDate,
    );

    // Create leave
    const leave = await this.prisma.leave.create({
      data: {
        reason: createLeaveDto.reason,
        startDate: startDate,
        endDate: endDate,
        employeeId: createLeaveDto.employeeId,
      },
    });

    return new SuccessResponseDto<LeaveResponseDto>(
      this.toLeaveResponse(leave),
      { message: 'Leave created successfully' },
    );
  }

  async findAll(): Promise<SuccessResponseDto<LeaveResponseDto[]>> {
    const [leaves, total] = await this.prisma.$transaction([
      this.prisma.leave.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.leave.count(),
    ]);

    const data = leaves.map(
      (leave) =>
        new LeaveResponseDto({
          ...leave,
          employee: new ResponseEmployeeDto(leave.employee),
        }),
    );

    return new SuccessResponseDto<LeaveResponseDto[]>(data, {
      message: 'Leaves retrieved successfully',
      total,
    });
  }

  async findOne(id: number): Promise<SuccessResponseDto<LeaveResponseDto>> {
    const leave = await this.prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return new SuccessResponseDto<LeaveResponseDto>(
      this.toLeaveResponse(leave),
      { message: 'Leave retrieved successfully' },
    );
  }

  async findByEmployee(
    employeeId: number,
  ): Promise<SuccessResponseDto<LeaveResponseDto[]>> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const leaves = await this.prisma.leave.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' },
    });

    const data = leaves.map((leave) => this.toLeaveResponse(leave));

    return new SuccessResponseDto<LeaveResponseDto[]>(data, {
      message: 'Employee leaves retrieved successfully',
    });
  }

  async update(
    id: number,
    updateLeaveDto: UpdateLeaveDto,
  ): Promise<SuccessResponseDto<LeaveResponseDto>> {
    // Check if leave exists
    const existingLeave = await this.prisma.leave.findUnique({
      where: { id },
    });

    if (!existingLeave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    const startDate = updateLeaveDto.startDate
      ? new Date(updateLeaveDto.startDate)
      : existingLeave.startDate;
    const endDate = updateLeaveDto.endDate
      ? new Date(updateLeaveDto.endDate)
      : existingLeave.endDate;
    const employeeId = updateLeaveDto.employeeId || existingLeave.employeeId;

    // Validasi tanggal
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Validasi constraints
    await this.validateLeaveConstraints(employeeId, startDate, endDate, id);

    const updatedLeave = await this.prisma.leave.update({
      where: { id },
      data: {
        reason: updateLeaveDto.reason,
        startDate: startDate,
        endDate: endDate,
        employeeId: employeeId,
      },
    });

    return new SuccessResponseDto<LeaveResponseDto>(
      this.toLeaveResponse(updatedLeave),
      { message: 'Leave updated successfully' },
    );
  }

  async remove(id: number): Promise<SuccessResponseDto<null>> {
    // Check if leave exists
    const leave = await this.prisma.leave.findUnique({
      where: { id },
    });

    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    await this.prisma.leave.delete({
      where: { id },
    });

    return new SuccessResponseDto<null>(null, {
      message: 'Leave deleted successfully',
    });
  }

  async getAllEmployeesWithLeaves(): Promise<
    SuccessResponseDto<EmployeeWithLeavesDto[]>
  > {
    const employees = await this.prisma.employee.findMany({
      include: {
        leaves: {
          orderBy: { startDate: 'desc' },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    const data = employees.map((employee) => {
      const totalLeaveDays = employee.leaves.reduce((total, leave) => {
        return total + this.calculateLeaveDays(leave.startDate, leave.endDate);
      }, 0);

      return new EmployeeWithLeavesDto({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        gender: Object.values(Gender).includes(employee.gender as Gender)
          ? (employee.gender as Gender)
          : undefined,
        leaves: employee.leaves.map((leave) => this.toLeaveResponse(leave)),
        totalLeaveDays,
      });
    });

    return new SuccessResponseDto<EmployeeWithLeavesDto[]>(data, {
      message: 'Employees with leaves retrieved successfully',
    });
  }
}
