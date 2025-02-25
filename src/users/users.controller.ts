import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Invitados, Users } from '@prisma/client';

@Controller('/user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    //Obtener todos los usuarios
    @Get('/')
    async getUsers() {
        return await this.usersService.getUsers();
    }
 
    //Obtener usuario por id
    @Get('/:id')
    async getUserById(@Param('id') id: number) {
        const cantidadInvitados = await this.usersService.getNumInvitados(Number(id));
        const acompanantes = await this.usersService.getAcompanantes(Number(id));
        
        return await this.usersService.getUserById(Number(id));
    }

    //Crear usuario
    @Post('/createUser')
    async createUsuario(@Body() data: Users) {
        return await this.usersService.createUsuario(data);
    }

    @Delete('/:id/deleteUser')
    async deleteUser(@Param('id') id: number) {
        return await this.usersService.deleteUser(Number(id));
    }


    @Post('/:user_id/addInvitado')
    async addInvitado(@Param('user_id') user_id: number, @Body() data: Invitados) {
        return await this.usersService.addInvitado(Number(user_id), data);
    }

    //Actualizar invitado
    @Patch('/:id/updateInvitado')
    async updateInvitado(@Param('id') id: number, @Body() data: Invitados) {
        return await this.usersService.updateInvitado(id, data);
    }

    //Borrar invitado
    @Delete('/:id/deleteInvitado')
    async deleteInvitado(@Param('id') id: number) {
        return await this.usersService.deleteInvitado(id);
    }

    //Obtener invitados del usuario
    @Get('/:user_id/invitados')
    async getInvitationsByUserId(@Param('user_id') user_id: number) {
        return await this.usersService.getInvitationsByUserId(Number(user_id));
    }
}