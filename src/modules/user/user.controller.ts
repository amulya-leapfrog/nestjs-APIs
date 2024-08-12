import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    fetchAll() {
        return this.userService.fetchAll()
    }

    @Get('/me')
    fetchMyDetails(){
        return this.userService.fetchMyDetails()
    }
    
    @Get(':id')
    fetchById(@Param('id') id: number){
        return this.userService.fetchById(id)
    }

    @Put()
    update(){
        return this.userService.update()
    }

    @Delete()
    delete(){
        return this.userService.delete()
    }
}
