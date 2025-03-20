import { Injectable, NotFoundException } from '@nestjs/common';
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


    async changeApproval(id: string, approved: boolean) {
        const report = await this.reportsRepository.findOne({ where: { id: parseInt(id) } });

        if(!report)
            throw new NotFoundException("report not found")

        report.approved = approved;

        return this.reportsRepository.save(report)
     
      }

}
