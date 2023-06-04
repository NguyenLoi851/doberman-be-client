import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Loan } from "../entities/loan.entity";

@Injectable()
export class LoanRepository extends Repository<Loan> {
    constructor(private dataSource: DataSource){
        super(Loan, dataSource.createEntityManager())
    }
}