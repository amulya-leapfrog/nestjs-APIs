import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookService {
    constructor(private dbConn: DatabaseService){}
}
