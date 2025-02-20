import { Injectable } from '@nestjs/common';
import { Invitados, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getUsers() {
        return await this.prisma.users.findMany({
            include: { invitado: true }
        });
    }

    async getUserById(id: number) {
        if(!id) throw new Error(`User ${id} not found`);
        
        return await this.prisma.users.findUnique({
            where: { id },
            include: { invitado: true }
        });
    }

    async createUsuario(data: Users) {
        return await this.prisma.users.create({
            data: {
                nombre: data.nombre,
                telefono: data.telefono,
                num_invitados: data.num_invitados ?? 0
            }
        });
    }

    async deleteUser(id: number){
        return await this.prisma.users.delete({
            where:{id}
        })
    }

    async addInvitado(user_id: number, data: Invitados) {
        const invitado = await this.prisma.invitados.create({
            data: {
                nombre: data.nombre,
                user_id: user_id
            }
        });
    
        // Contar el número actual de invitados y actualizar el usuario
        const countInvitados = await this.prisma.invitados.count({
            where: { user_id }
        });
    
        await this.prisma.users.update({
            where: { id: user_id },
            data: { num_invitados: countInvitados }
        });
    
        return invitado;
    }
    

    async updateInvitado(id: number, data: Invitados) {
        return await this.prisma.invitados.update({
            where: { id },
            data
        });
    }

    async deleteInvitado(id: number) {
        return await this.prisma.invitados.delete({
            where: { id }
        });
    }

    //Invitados del usuario
    async getInvitationsByUserId(user_id: number) {
        return await this.prisma.invitados.findMany({
            where: { user_id }
        });
    }
}