import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LinkProxyDTO } from "../dtos/proxy.dto";
import { ProxyService } from "../services/proxy.service";

@ApiTags('Proxies')
@Controller('proxies')
export class ProxyController {
    constructor(private proxyService: ProxyService) { }

    @Post('link-proxy')
    async linkProxy(@Body() linkProxyDTO: LinkProxyDTO) {
        return await this.proxyService.linkProxy(linkProxyDTO);
    }

    @Get(':address')
    async getProxyByOwner(@Param('address') address: string) {
        return await this.proxyService.getProxyByOwner(address);
    }
}
