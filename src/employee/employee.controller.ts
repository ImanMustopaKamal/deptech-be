import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import { JwtGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { ErrorResponseDto } from '../../common/dto/error-response.dto';
import { ResponseEmployeeDto } from './dto/response-employee.dto';

@ApiTags('employee')
@Controller('employee')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new employee',
    description: 'Create a new employee account. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'employee created successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email or phone number already exists',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: CreateEmployeeDto })
  async create(
    @Body() createEmployee: CreateEmployeeDto,
  ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    return this.employeeService.create(createEmployee);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all employee',
    description:
      'Retrieve a list of all employee accounts. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'employee retrieved successfully',
    type: SuccessResponseDto,
  })
  async findAll(
  ): Promise<SuccessResponseDto<ResponseEmployeeDto[]>> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get employee by ID',
    description:
      'Retrieve a specific employee by their ID. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'employee retrieved successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'employee not found',
    type: ErrorResponseDto,
  })
  @ApiParam({ name: 'id', description: 'employee ID', type: Number })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update employee',
    description: 'Update an existing employee account. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'employee updated successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'employee not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email or phone number already exists',
    type: ErrorResponseDto,
  })
  @ApiParam({ name: 'id', description: 'employee ID', type: Number })
  @ApiBody({ type: UpdateEmployeeDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete employee',
    description: 'Delete a employee account. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'employee deleted successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'employee not found',
    type: ErrorResponseDto,
  })
  @ApiParam({ name: 'id', description: 'employee ID', type: Number })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto<null>> {
    return this.employeeService.remove(id);
  }

  // @Get('email/:email')
  // @ApiOperation({
  //   summary: 'Get employee by email',
  //   description:
  //     'Retrieve a specific employee by their email. Requires authentication.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'employee retrieved successfully',
  //   type: SuccessResponseDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'employee not found',
  //   type: ErrorResponseDto,
  // })
  // @ApiParam({ name: 'email', description: 'employee email address' })
  // async findByEmail(
  //   @Param('email') email: string,
  // ): Promise<SuccessResponseDto<ResponseEmployeeDto>> {
  //   return this.employeeService.findByEmail(email);
  // }
}
