import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UserRepository extends Repository<User> {
    // constructor(
    //     @InjectRepository(User) userRepository: Repository<User>
    // ) {
    //     super(userRepository.target, userRepository.manager, userRepository.queryRunner)
    // }
    constructor(private dataSource: DataSource){
        super(User, dataSource.createEntityManager())
    }
}
