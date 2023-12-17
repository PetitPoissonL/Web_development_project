import { Body, Controller, Get, Inject, Post, Render, Param, Res, Req, Response, UseGuards, Request } from '@nestjs/common';
import { response } from 'express';
import { ContractService } from '../../api/contract/contract.service';
import { Insurance } from '../../shared/models/insurance.model';
import { Quote } from '../../shared/models/quote.model';
import { Bill } from '../../shared/models/bill.model';

@Controller('contract')
export class ContractController{
  constructor(
    private readonly contractService : ContractService
  ){}

  // @Post('storage_contract')
  // public async saveContract():Promise<any>{
    
  // }
}