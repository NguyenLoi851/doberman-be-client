import { Role } from "src/enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'proxies'})
export class Proxy {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    userAddress: string

    @Column({nullable: true})
    borrowerProxy: string
}