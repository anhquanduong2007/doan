import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SpecialityController],
  providers: [SpecialityService]
})
export class SpecialityModule { }
