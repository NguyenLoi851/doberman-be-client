import { Frequency } from "src/enums/frequency.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'loans'})
export class Loan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    companyName: string

    @Column()
    companyIntro: string
    
    @Column()
    companyPage: string

    @Column()
    companyContact: string

    @Column()
    projectName: string

    @Column()
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

    @Column({default: false})
    deployed: Boolean

    @Column({nullable: true})
    txHash: string
}
