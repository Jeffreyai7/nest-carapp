import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
 
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {

        return this.usersService.create(body.email, body.password);

    }

    @Get("/user")
    findAllUsers(@Query("email") email: string){
        return this.usersService.find(email);
    }
    
    @Get("/:id")
    async findUser(@Param("id") id:string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }


    @Delete("/:id")
    removeUser(@Param("id") id: string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto){

        return this.usersService.update(parseInt(id), body)
    }
}
