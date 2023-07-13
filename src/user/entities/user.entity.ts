import { KycStatus } from "src/enums/kycStatus.enum";
import { Role } from "src/enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    address: string

    @Column()
    role: Role
}
