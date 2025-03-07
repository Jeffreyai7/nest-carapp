import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service"; 
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { aw } from "framer-motion/dist/types.d-6pKw1mTI";


describe("AuthService", () => {
    let service: AuthService;

    let fakeUsersService: Partial<UsersService>;
    
    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
              const filteredUsers = users.filter((user) => user.email === email);
              return Promise.resolve(filteredUsers);
              },  
            create: (email: string, password: string) => 
            {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        }    
        
        const module = await Test.createTestingModule({
            providers: [AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
    
                }]
        }).compile();
     service = module.get(AuthService);
    })
    
    
    it("creates an instance of AuthService", async () => {
        expect(service).toBeDefined()
    })


    it("creates a new user with a salted and hashed password", async () => {

        const user = await service.signup("jerry@eee.com", "password");
        expect(user.password).not.toEqual("password");
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })


    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () =>
     
          Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
      });

      
      it('throws if signin is called with an unused email', async () => {
        await expect( 
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException)
      });

      it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
          Promise.resolve([
            { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
          ]);
        await expect(
          service.signin('laskdjf@alskdfj.com', 'passowrd'),
        ).rejects.toThrow(BadRequestException);
      });


      it('returns a user if correct password is provided', async () => {
       await service.signup('asdf@asdf.com', 'laskdjf');
        const user = await service.signin('asdf@asdf.com', 'laskdjf'); // ✅ Corrected
        expect(user.password).toBeDefined(); // ✅ Now user contains a resolved value
    });
    

      

})