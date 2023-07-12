import { Frequency } from "src/enums/frequency.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LegalDocument } from "./legalDocument.entity";

@Entity({ name: 'loans' })
export class Loan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    companyName: string

    @Column('longtext')
    companyIntro: string

    @Column()
    companyPage: string

    @Column()
    companyContact: string

    @Column()
    projectName: string

    @Column('longtext')
    projectIntro: string

    @Column()
    juniorFeePercent: number

    @Column()
    targetFunding: number

    @Column()
    interestRate: number

    @Column()
    interestPaymentFrequency: Frequency // months (production), minutes (develop)

    @Column()
    loanTerm: number // months (production), minutes (develop)

    @Column()
    fundableAt: number

    @Column()
    ownerAddress: string

    @Column({ default: false })
    deployed: Boolean

    @Column({ nullable: true })
    txHash: string

    @OneToMany(type => LegalDocument, legalDocument => legalDocument.loan, { nullable: true })
    legalDocuments: LegalDocument[]
}
