import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Invitados, Users } from '@prisma/client';

@Controller('/user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    // Obtener todos los usuarios
    @Get('/')
    async getUsers() {
        return await this.usersService.getUsers();
    }

    // Obtener usuario por id
    @Get('/:id')
    async getUserById(@Param('id') id: number) {
        return await this.usersService.getUserById(Number(id));
    }

    // Obtener usuario por nombre
    @Get('/nombre/:nombre')
    async getUserByName(@Param('nombre') nombre: string) {
        return await this.usersService.getUserByName(nombre);
    }

    // Crear usuario
    @Post('/createUser')
    async createUsuario(@Body() data: Users) {
        return await this.usersService.createUsuario(data);
    }

    // Actualizar usuario
    @Patch('/:id/updateUser/:invite')
    async updateUser(@Param('id') id: number, @Body() data: Users) {
        return await this.usersService.updateUser(Number(id), data);
    }

    // Eliminar usuario
    @Delete('/:id/deleteUser')
    async deleteUser(@Param('id') id: number) {
        return await this.usersService.deleteUser(Number(id));
    }

    // Añadir un invitado
    @Post('/:user_id/addInvitado')
    async addInvitado(@Param('user_id') user_id: number, @Body() data: Invitados) {
        return await this.usersService.addInvitado(Number(user_id), data);
    }

    // Actualizar invitado
    @Patch('/:id/updateInvitado/:invite')
    async updateInvitado(@Param('id') id: number, @Body() data: Invitados, @Param('invite') invite: number) {
        return await this.usersService.updateInvitado(Number(id), data, Number(invite));
    }

    // Eliminar invitado
    @Delete('/:id/deleteInvitado/:invite')
    async deleteInvitado(@Param('id') id: number, @Param('invite') invite: number){
        return await this.usersService.deleteInvitado(Number(id), Number(invite));
    }

    // Obtener los invitados de un usuario
    @Get('/:user_id/invitados')
    async getInvitationsByUserId(@Param('user_id') user_id: number) {
        return await this.usersService.getInvitationsByUserId(Number(user_id));
    }
}
