import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    address: string
}