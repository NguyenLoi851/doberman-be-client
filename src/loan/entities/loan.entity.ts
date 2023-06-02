import { Frequency } from "src/enums/frequency.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'loans'})
export class Loan {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    borrower: string

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
    interestPaymentFrequency: Frequency

    @Column()
    loanTerm: number // months (production), minutes (develop)

    @Column()
    fundableAt: number
}
