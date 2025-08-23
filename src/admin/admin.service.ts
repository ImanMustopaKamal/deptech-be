import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { AdminResponseDto } from './dto/response-admin.dto';
import { SuccessResponseDto } from 'common/dto/success-response.dto';
import { AdminSuccessResponse } from './dto/success-admin-response.type';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private toAdminResponse(admin: any): AdminResponseDto {
    return new AdminResponseDto({
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      dateOfBirth: admin.dateOfBirth,
      gender: admin.gender,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
  }

  async create(createAdminDto: CreateAdminDto): Promise<AdminSuccessResponse> {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
        email: createAdminDto.email,
        dateOfBirth: new Date(createAdminDto.dateOfBirth),
        gender: createAdminDto.gender,
        password: hashedPassword,
      },
    });

    return new SuccessResponseDto<AdminResponseDto>(
      this.toAdminResponse(admin),
      { message: 'Admin created successfully' },
    );
  }

  async findAll(): Promise<AdminSuccessResponse> {
    const [admins, total] = await this.prisma.$transaction([
      this.prisma.admin.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.admin.count(),
    ]);

    const data = admins.map((a) => this.toAdminResponse(a));

    return new SuccessResponseDto<AdminResponseDto[]>(data, {
      message: 'Admin retrieved successfully',
      total,
    });
  }

  async findOne(id: number): Promise<AdminSuccessResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return new SuccessResponseDto<AdminResponseDto>(
      this.toAdminResponse(admin),
      {
        message: 'Admin retrieved successfully',
      },
    );
  }

  async findByEmail(email: string): Promise<AdminResponseDto> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }

    return admin;
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminSuccessResponse> {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    if (updateAdminDto.email && updateAdminDto.email !== existingAdmin.email) {
      const emailExists = await this.prisma.admin.findUnique({
        where: { email: updateAdminDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Admin with this email already exists');
      }
    }

    const updateData: any = { ...updateAdminDto };

    if (
      updateAdminDto.password === '' ||
      updateAdminDto.password === undefined ||
      updateAdminDto.password === null
    ) {
      delete updateData.password;
    } else {
      updateData.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    if (updateAdminDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateAdminDto.dateOfBirth);
    }

    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: updateData,
    });

    return new SuccessResponseDto<AdminResponseDto>(
      this.toAdminResponse(updatedAdmin),
      {
        message: 'Admin updated successfully',
      },
    );
  }

  async remove(id: number, req: any): Promise<SuccessResponseDto<any>> {
    const user = req.user;
    if (user.sub && user.sub === id) {
      throw new NotFoundException(`Cant remove your self`);
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    const adminCount = await this.prisma.admin.count();
    if (adminCount <= 1) {
      throw new BadRequestException('Cannot delete the last admin');
    }

    await this.prisma.admin.delete({
      where: { id },
    });

    return new SuccessResponseDto(null, {
      message: 'Admin deleted successfully',
    });
  }

  // async getProfile(id: number): Promise<AdminResponseDto> {
  //   return this.findOne(id);
  // }

  // async updateProfile(
  //   id: number,
  //   updateAdminDto: UpdateAdminDto,
  // ): Promise<AdminResponseDto> {
  //   return this.update(id, updateAdminDto);
  // }
}
