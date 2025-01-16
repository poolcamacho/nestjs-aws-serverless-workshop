import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    async createUser(@Body() user: {id: string, name: string, email: string})
    {
        return await this.userService.createUser(user)
    }

    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers()
    }
}
