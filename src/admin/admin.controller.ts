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
  Req,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
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
import { AdminSuccessResponse } from './dto/success-admin-response.type';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new admin',
    description: 'Create a new admin account. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: CreateAdminDto })
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminSuccessResponse> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all admins',
    description:
      'Retrieve a list of all admin accounts. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admins retrieved successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  async findAll(): Promise<AdminSuccessResponse> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get admin by ID',
    description:
      'Retrieve a specific admin by their ID. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin retrieved successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdminSuccessResponse> {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update admin',
    description: 'Update an existing admin account. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin updated successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  @ApiBody({ type: UpdateAdminDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminSuccessResponse> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete admin',
    description:
      'Delete an admin account. Cannot delete the last admin. Requires authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin deleted successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete the last admin',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<AdminSuccessResponse> {
    return this.adminService.remove(id, req);
  }

  // @Get('profile/:id')
  // @ApiOperation({ summary: 'Get admin profile', description: 'Get profile information of a specific admin. Requires authentication.' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Profile retrieved successfully', type: SuccessResponseDto })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Admin not found', type: ErrorResponseDto })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ErrorResponseDto })
  // @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  // async getProfile(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseDto> {
  //   return this.adminService.getProfile(id);
  // }

  // @Patch('profile/:id')
  // @ApiOperation({ summary: 'Update admin profile', description: 'Update profile information of a specific admin. Requires authentication.' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully', type: SuccessResponseDto })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Admin not found', type: ErrorResponseDto })
  // @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists', type: ErrorResponseDto })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ErrorResponseDto })
  // @ApiParam({ name: 'id', description: 'Admin ID', type: Number })
  // @ApiBody({ type: UpdateAdminDto })
  // async updateProfile(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateAdminDto: UpdateAdminDto
  // ): Promise<SuccessResponseDto> {
  //   return this.adminService.updateProfile(id, updateAdminDto);
  // }

  // @Get('email/:email')
  // @ApiOperation({ summary: 'Get admin by email', description: 'Retrieve a specific admin by their email. Requires authentication.' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Admin retrieved successfully', type: SuccessResponseDto })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Admin not found', type: ErrorResponseDto })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ErrorResponseDto })
  // @ApiParam({ name: 'email', description: 'Admin email address' })
  // async findByEmail(@Param('email') email: string): Promise<SuccessResponseDto> {
  //   return this.adminService.findByEmail(email);
  // }
}
