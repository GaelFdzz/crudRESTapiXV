import { BadRequestException, Injectable } from '@nestjs/common';
import { Invitados, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    //Cuantos puede invitar
    async getNumInvitados(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            select: { num_invitados: true }
        });


        //Asignar el numero de invitados del usuario en una constante
        const numInvitados = await user?.num_invitados;
        return numInvitados;
    }


    //Cuantos ha invitado
    async getAcompanantes(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            select: { invitado: true }
        })

        const numInvitados = await user?.invitado.length;
        return numInvitados;
    }


    async getUsers() {
        return await this.prisma.users.findMany({
            include: { invitado: true }
        });
    }

    async getUserById(id: number) {
        if (!id) throw new Error(`User ${id} not found`);

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

    async deleteUser(id: number) {
        return await this.prisma.users.delete({
            where: { id }
        })
    }

    async addInvitado(user_id: number, data: Invitados) {

        //A cuantos ha invitado el usuario
        const haInvitado = await this.getAcompanantes(user_id) ?? 0;

        //Cuanto es lo maximo que puede invitar
        const maxInvitados = await this.getNumInvitados(user_id) ?? 0;

        // Validar si el usuario ha superado el límite
        if (haInvitado >= maxInvitados-1) {
            throw new BadRequestException({
                message: `El usuario ha superado el límite de invitados`
            });
        }

        const invitado = await this.prisma.invitados.create({
            data: {
                nombre: data.nombre,
                user_id: user_id
            }
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
            where: { user_id: user_id }
        });
    }
}