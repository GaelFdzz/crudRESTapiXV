import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Invitados, Users } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getNumInvitados(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            select: { num_invitados: true }
        })

        if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`)

        return user.num_invitados ?? 0
    }

    async getAcompanantes(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            select: { invitado: true }
        })

        if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`)

        return user.invitado.length
    }

    async getUsers() {
        return this.prisma.users.findMany({
            include: { invitado: true }
        })
    }

    async getUserById(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            include: { invitado: true }
        });

        if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`)

        return user
    }

    async getUserByName(nombre: string) {
        const user = await this.prisma.users.findMany({
            where: {
                nombre: { contains: nombre } //Muestra todos los registros que contengan parcial o completamente el nombre
            },
            include: { invitado: true }
        })

        if (!user) throw new NotFoundException(`Usuario con nombre ${nombre} no encontrado`)
        return user
    }

    async createUsuario(data: Users) {
        return this.prisma.users.create({
            data: {
                nombre: data.nombre,
                telefono: data.telefono,
                num_invitados: data.num_invitados ?? 0
            }
        })
    }

    async updateUser(id: number, data: Users) {
        await this.getUserById(id) // Verificar existencia antes de actualizar
        return this.prisma.users.update({
            where: {id},
            data
        })
    }

    async deleteUser(id: number) {
        await this.getUserById(id) // Verificar existencia antes de eliminar
        return this.prisma.users.delete({ where: { id } })
    }

    async addInvitado(user_id: number, data: Invitados) {
        const haInvitado = await this.getAcompanantes(user_id)
        const maxInvitados = await this.getNumInvitados(user_id)

        if (haInvitado >= maxInvitados - 1) {
            throw new BadRequestException(`El usuario ha alcanzado el límite de invitados`);
        } else {
            return this.prisma.invitados.create({
                data: { nombre: data.nombre, user_id }
            })
        }
    }

    async updateInvitado(id: number, data: Invitados, invite: number) {
        await this.getUserById(id)
        return this.prisma.invitados.update({ where: { id: invite }, data })
    }

    async deleteInvitado(id: number, invite: number) {
        await this.getUserById(id)
        return this.prisma.invitados.delete({ 
            where: { id: invite }
        })
    }

    async getInvitationsByUserId(user_id: number) {
        return this.prisma.invitados.findMany({ where: { user_id } })
    }
}