import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const { email, name, password, username } = dto;
    const debug = process.env.DEBUG_AUTH === 'true';

    if (debug) console.log('[auth] signup attempt:', { email, name, username });

    if (!email || !password || !name) {
      throw new HttpException(
        'Missing required fields: email, name, and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 6) {
      throw new HttpException(
        'Password must be at least 6 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const generatedUsername = username || email.split('@')[0];

      const user = await this.usersService.create({
        username: generatedUsername,
        email: email.toLowerCase().trim(),
        password,
        name,
      });

      if (debug) console.log('[auth] user created successfully:', user._id);

      return user;
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        throw new HttpException(
          'User with this email or username already exists',
          HttpStatus.CONFLICT,
        );
      }
      if (debug) console.error('[auth] signup error:', error);
      throw new HttpException(
        'Failed to create user account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // NOTE: For simple dev flow we compare plaintext. If you hash passwords, replace with bcrypt.compare
    if (user.password !== password) {
      if (debug)
        console.log(
          '[auth] password mismatch; stored:',
          user.password,
          'received:',
          password,
        );
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Remove password before returning
    const { password: _p, ...profile } = user as any;
    return profile;
  }
}
