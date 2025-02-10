import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

        create(email: string, password: string) {
        const user = this.usersRepository.create({ email, password });
         
        return this.usersRepository.save(user);
        }

       async find(email: string) {
        return await this.usersRepository.find({ where: { email } });
        }

    
        async findOne(id: number){
        return await this.usersRepository.findOne({where: {id}});
        }

        async update(id: number, attrs: Partial<User>) {
            const user = await this.findOne(id);
            if(!user){
                throw new Error('User not found');
            }
            Object.assign(user, attrs);
            return this.usersRepository.save(user);
        }

        async remove(id: number) {
            const user = await this.findOne(id);
            if(!user){
                throw new Error('User not found');
            }
            return this.usersRepository.remove(user);

        }

    }

const usersService = new UsersService( {} as any);    


