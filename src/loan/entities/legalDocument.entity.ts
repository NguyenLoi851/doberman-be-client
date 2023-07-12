import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Loan } from "./loan.entity";

@Entity({ name: 'legalDocuments' })
export class LegalDocument {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    fileKey: string

    @ManyToOne(type => Loan, loan => loan.legalDocuments)
    loan: Loan
}
