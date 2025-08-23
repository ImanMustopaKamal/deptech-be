import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, Gender } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ResponseEmployeeDto } from './dto/response-employee.dto';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  private toPegawaiResponse(employee: any): ResponseEmployeeDto {
    return new ResponseEmployeeDto({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      gender: employee.gender,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  }

  async create(
    createEmployee: CreateEmployeeDto,
  ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: createEmployee.email },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    // Create employee
    const employee = await this.prisma.employee.create({
      data: {
        firstName: createEmployee.firstName,
        lastName: createEmployee.lastName,
        email: createEmployee.email,
        phone: createEmployee.phone,
        address: createEmployee.address,
        gender: createEmployee.gender,
      },
    });

    return new SuccessResponseDto<ResponseEmployeeDto>(
      this.toPegawaiResponse(employee),
      { message: 'Employee created successfully' },
    );
  }

  async findAll(): Promise<SuccessResponseDto<ResponseEmployeeDto[]>> {
    const [employees, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count(),
    ]);

    const data = employees.map((employee) => this.toPegawaiResponse(employee));

    return new SuccessResponseDto<ResponseEmployeeDto[]>(data, {
      message: 'Employees retrieved successfully',
      total,
    });
  }

  async findOne(id: number): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return new SuccessResponseDto<ResponseEmployeeDto>(
      this.toPegawaiResponse(employee),
      { message: 'Employee retrieved successfully' },
    );
  }

  async findByEmail(
    email: string,
  ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${email} not found`);
    }

    return new SuccessResponseDto<ResponseEmployeeDto>(
      this.toPegawaiResponse(employee),
      { message: 'Employee retrieved successfully' },
    );
  }

  async update(
    id: number,
    updateEmployee: UpdateEmployeeDto,
  ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Check if email is being changed and if it's already taken
    if (
      updateEmployee.email &&
      updateEmployee.email !== existingEmployee.email
    ) {
      const emailExists = await this.prisma.employee.findUnique({
        where: { email: updateEmployee.email },
      });

      if (emailExists) {
        throw new ConflictException('Employee with this email already exists');
      }
    }

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: {
        firstName: updateEmployee.firstName,
        lastName: updateEmployee.lastName,
        email: updateEmployee.email,
        phone: updateEmployee.phone,
        address: updateEmployee.address,
        gender: updateEmployee.gender,
      },
    });

    return new SuccessResponseDto<ResponseEmployeeDto>(
      this.toPegawaiResponse(updatedEmployee),
      { message: 'Employee updated successfully' },
    );
  }

  async remove(id: number): Promise<SuccessResponseDto<null>> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    await this.prisma.employee.delete({
      where: { id },
    });

    return new SuccessResponseDto<null>(null, {
      message: 'Employee deleted successfully',
    });
  }
}
