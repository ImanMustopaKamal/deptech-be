import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
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
import { LeaveResponseDto } from './dto/response-leave.dto';
import { EmployeeWithLeavesDto } from './dto/employee-with-leaves.dto';

@ApiTags('leaves')
@Controller('leaves')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new leave',
    description:
      'Create a new leave request with validation rules. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Leave created successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error or constraint violation',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: CreateLeaveDto })
  async create(
    @Body() createLeaveDto: CreateLeaveDto,
  ): Promise<SuccessResponseDto<LeaveResponseDto>> {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all leaves',
    description:
      'Retrieve a list of all leave requests. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leaves retrieved successfully',
    type: SuccessResponseDto,
  })
  async findAll(): Promise<SuccessResponseDto<LeaveResponseDto[]>> {
    return this.leaveService.findAll();
    //   return this.leaveService.getAllEmployeesWithLeaves();
  }

  @Get('employees-with-leaves')
  @ApiOperation({
    summary: 'Get all employees with their leaves',
    description:
      'Retrieve list of all employees with their leave information. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employees with leaves retrieved successfully',
    type: SuccessResponseDto,
  })
  async getAllEmployeesWithLeaves(): Promise<
    SuccessResponseDto<EmployeeWithLeavesDto[]>
  > {
    return this.leaveService.getAllEmployeesWithLeaves();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get leave by ID',
    description:
      'Retrieve a specific leave request by ID. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave retrieved successfully',
    type: SuccessResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Leave ID', type: Number })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto<LeaveResponseDto>> {
    return this.leaveService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update leave',
    description: 'Update an existing leave request. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave updated successfully',
    type: SuccessResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Leave ID', type: Number })
  @ApiBody({ type: UpdateLeaveDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveDto: UpdateLeaveDto,
  ): Promise<SuccessResponseDto<LeaveResponseDto>> {
    return this.leaveService.update(id, updateLeaveDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete leave',
    description: 'Delete a leave request. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leave deleted successfully',
    type: SuccessResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Leave ID', type: Number })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto<null>> {
    return this.leaveService.remove(id);
  }

  // @Get('employee/:employeeId')
  // @ApiOperation({
  //   summary: 'Get leaves by employee',
  //   description: 'Retrieve all leave requests for a specific employee. Requires authentication.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Employee leaves retrieved successfully',
  //   type: SuccessResponseDto,
  // })
  // @ApiParam({ name: 'employeeId', description: 'Employee ID', type: Number })
  // async findByEmployee(@Param('employeeId', ParseIntPipe) employeeId: number): Promise<SuccessResponseDto<LeaveResponseDto[]>> {
  //   return this.leaveService.findByEmployee(employeeId);
  // }
}
