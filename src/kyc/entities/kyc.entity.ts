import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'kyc'})
export class KYC {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({unique: true})
    address: string

    @Column()
    mintSignature: string
}