import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const admin = await this.validateAdmin(email, password);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email, sub: admin.id, role: 'admin' };
    const access_token = this.jwtService.sign(payload);

    return new SuccessResponseDto(
      {
        ...admin,
        access_token,
      },
      { message: 'Login successful' },
    );
  }

  async changePassword(
    adminId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin || !(await bcrypt.compare(oldPassword, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    return new SuccessResponseDto(null, {
      message: 'Password changed successfully'
    });
  }

  // async verifyToken(token: string) {
  //   try {
  //     return this.jwtService.verify(token);
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid token');
  //   }
  // }

  // async getAdminFromToken(token: string) {
  //   const decoded = await this.verifyToken(token);
  //   return this.prisma.admin.findUnique({
  //     where: { id: decoded.sub },
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       email: true,
  //       dateOfBirth: true,
  //       gender: true,
  //     },
  //   });
  // }
}
