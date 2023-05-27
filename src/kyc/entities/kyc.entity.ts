import { Column, Entity } from "typeorm";

@Entity({name: 'kyc'})
export class KYC {
    @Column({unique: true})
    address: string

    @Column()
    mintSignature: string
}