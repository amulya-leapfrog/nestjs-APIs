import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import serverConfig from 'src/config';

@Global()
@Injectable()
export class DatabaseService extends PrismaClient {
    constructor(){
        super({
            datasources:{
                db:{
                    url: serverConfig.databaseConnection
                }
            }
        })
    }
}
