import { KycStatus } from "src/enums/kycStatus.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'kyc' })
export class KYC {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    address: string

    @Column({ nullable: true })
    mintSignature: string

    @Column({ nullable: true })
    kycId: string

    @Column({ default: KycStatus.INIT })
    kycStatus: KycStatus

    @Column({ nullable: true })
    kycExternalUserId: string
}
