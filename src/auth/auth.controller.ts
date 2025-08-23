import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { JwtGuard } from './auth.guard';
import { Public } from 'common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login admin' })
  @ApiResponse({ status: 200, description: 'Admin successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    console.log("🚀 ~ AuthController ~ login ~ loginDto:", loginDto)
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Change admin password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or token' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: ChangePasswordDto })
  @UseGuards(JwtGuard)
  async changePassword(
    @Req() req,
    @Body() dto: ChangePasswordDto,
    @Res() res: Response,
  ) {
    const user = req.user;
    const result = await this.authService.changePassword(
      user.sub,
      dto.oldPassword,
      dto.newPassword,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  // @Get('profile')
  // @ApiOperation({ summary: 'Get admin profile' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Admin profile retrieved successfully',
  // })
  // @ApiResponse({ status: 401, description: 'Invalid token' })
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtGuard)
  // async getProfile(@Req() req) {
  //   const user = req.user;
  //   console.log("🚀 ~ AuthController ~ getProfile ~ user:", user)
  //   return { message: 'Protected route, JWT required!', data: user };
  // }
}
