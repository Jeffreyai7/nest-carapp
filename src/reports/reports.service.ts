import { Injectable } from '@nestjs/common';
import { Report } from './reports.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>){}


    create(reportDto: CreateReportDto, user: User){
        const report = this.reportsRepository.create(reportDto)
        report.user = user
        return this.reportsRepository.save(report)
    }


}
