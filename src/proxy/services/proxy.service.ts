import { ApolloClient, gql, InMemoryCache, HttpLink } from "@apollo/client/core";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LinkProxyDTO } from "../dtos/proxy.dto";
import { Proxy } from "../entities/proxy.entity";
import fetch from 'cross-fetch';

@Injectable()
export class ProxyService {
    constructor(
        @InjectRepository(Proxy) private proxyRepository: Repository<Proxy>,
        private configService: ConfigService,
    ){}

    async linkProxy(linkProxyDTO: LinkProxyDTO) {
        const tokensQuery = `query BorrowerPage($userId: String!){
            borrowerContracts(where: {user: $userId}) {
              id
            }
        }`

        const client = new ApolloClient({
            link: new HttpLink({uri: this.configService.get<string>('SUB_GRAPH_API_URL'), fetch}),
            cache: new InMemoryCache(),
        })

        const res = await client.query({
            query: gql(tokensQuery),
            variables: {
                userId: linkProxyDTO.userAddress.toLowerCase(),
            },
        })

        await this.proxyRepository.upsert(
            {userAddress: linkProxyDTO.userAddress.toLowerCase(), borrowerProxy: res.data.borrowerContracts[0].id},
            ['userAddress']
        )
    }
}
