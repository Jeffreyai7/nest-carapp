import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()   
export class AuthService {
    constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {   
        
        const users = await this.usersService.find(email);

        if(users.length){
            throw new BadRequestException("email in use")
        }

        // generate a salt
        const salt = randomBytes(8).toString('hex'); /// generate a random string of 16 characters and numbers
        // hash the salt and the password together  
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        // join the hashed result with the salt
        const result = salt + '.' + hash.toString('hex');


    }

    signin() {}
}