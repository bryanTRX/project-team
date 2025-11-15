import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { username, password } = dto;
    const debug = process.env.DEBUG_AUTH === 'true';
    if (debug) console.log('[auth] login attempt:', { username, password });
    if (!username || !password) {
      throw new HttpException('Missing credentials', HttpStatus.BAD_REQUEST);
    }

    let user = await this.usersService.findByUsername(username);
    if (!user) {
      // try treating the provided identifier as an email
      user = await this.usersService.findByEmail(username);
    }
    if (!user) {
      if (debug) console.log('[auth] user not found for', username);
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    // NOTE: For simple dev flow we compare plaintext. If you hash passwords, replace with bcrypt.compare
    if (user.password !== password) {
      if (debug) console.log('[auth] password mismatch; stored:', user.password, 'received:', password);
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    // Remove password before returning
    const { password: _p, ...profile } = user as any;
    return profile;
  }
}
