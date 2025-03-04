import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';


@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
 
    constructor(private usersService: UsersService, private authService: AuthService) {}

    // @Get("/colors/:color")
    // setColor(@Param("color") color: string, @Session() session: any){
    //     session.color = color;
    // }
    
    // @Get("/colors")
    // getColor(@Param() color: string, @Session() session: any){
    //   return  session.color 
    // }
    
    @Get('/whoami')
   async whoAmI(@CurrentUser() user: User){
       return user;
    }

    @Post('/signout')
    signOut(@Session() session: any){           
        session.userId = null;
        return this.usersService.findOne(session.userId);
    }
    
    @Post('/signup')
   async createUser(@Body() body: CreateUserDto, @Session() session: any) {

        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;

    }
    

    @Post('/signin')
   async login(@Body() body: CreateUserDto, @Session() session: any) {

        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id
        return user; 
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
