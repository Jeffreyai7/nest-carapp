import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './reports.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>){}

    createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return this.reportsRepository
        .createQueryBuilder()
        .select("AVG(price)", "price")
        .where("make = :make", { make })
        .andWhere("model = :model", { model })
        .andWhere("lng - :lng BETWEEN -5 AND 5", { lng })
        .andWhere("lat - :lat BETWEEN -5 AND 5", { lat })
        .andWhere("lat - :lat BETWEEN -5 AND 5", { lat })
        .andWhere("year - :year BETWEEN -3 AND 3", { year })
        .andWhere("approved IS TRUE")
        .orderBy("ABS(mileage - :mileage)", "DESC")
        .setParameters({ mileage })
        .limit(233)
        .getRawOne();
    }


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
