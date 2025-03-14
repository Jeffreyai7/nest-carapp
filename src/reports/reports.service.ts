import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>){}


    create(reportDto: CreateReportDto){
        const report = this.reportsRepository.create(reportDto)
        return this.reportsRepository.save(report)
    }


}
