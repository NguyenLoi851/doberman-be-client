import { ApolloClient, gql, InMemoryCache, HttpLink } from "@apollo/client/core";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
    ) { }

    async linkProxy(linkProxyDTO: LinkProxyDTO): Promise<string> {
        const tokensQuery = `query BorrowerPage($userId: String!){
            borrowerContracts(where: {user: $userId}, orderBy: createdAt, orderDirection: desc) {
              id
            }
        }`

        const client = new ApolloClient({
            link: new HttpLink({ uri: this.configService.get<string>('SUB_GRAPH_API_URL'), fetch }),
            cache: new InMemoryCache(),
        })

        const res = await client.query({
            query: gql(tokensQuery),
            variables: {
                userId: linkProxyDTO.userAddress.toLowerCase(),
            },
        })

        if (res.data == null || res.data.borrowerContracts.length == 0) {
            throw new HttpException('Not exist borrower contract', HttpStatus.BAD_REQUEST)
        }

        try {
            const proxy: string = res.data.borrowerContracts[0].id.toLowerCase()
            await this.proxyRepository.upsert(
                { userAddress: linkProxyDTO.userAddress.toLowerCase(), borrowerProxy: proxy },
                ['userAddress']
            )
            return proxy
        } catch (error) {
            console.log(error);
        }
    }

    async getProxyByOwner(ownerAddress: string): Promise<string> {
        const proxyEntity = await this.proxyRepository.findOne({
            where: {
                userAddress: ownerAddress.toLowerCase()
            }
        })
        // if (!proxyEntity) {
        //     const proxy = await this.linkProxy({userAddress: ownerAddress})
        //     return proxy
        // }
        if (!proxyEntity) {
            throw new HttpException('Not exist borrower proxy contract', HttpStatus.BAD_REQUEST)
        }

        return proxyEntity.borrowerProxy
    }
}
