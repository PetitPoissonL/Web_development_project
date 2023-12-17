import { Body, Controller, Get, Inject, Post, Render, Param, Res, Req, Response, UseGuards, Query, Request} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DashboardService } from './dashboard.service';
import { ContractService } from '../contract/contract.service';
import { Request as RequestType } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Usr } from '../user/user.decorator';

import { User } from '../../shared/models/user.model';
// import { User } from '@models/user.model';
import * as bcrypt               from 'bcrypt';

import { PaymentResponse } from 'src/shared/enums/payment-response.enum';


@Controller('dashboard')
export class DashboardController
{
  constructor
  (
    private readonly dashboardService : DashboardService,
    private readonly contractService: ContractService
  ) { }

  @Get('info_perso')
  @UseGuards(AuthGuard())
  public info_persoPage(@Usr() user : User, @Response() response) :void
  {
    console.log(user.id)
    let format_day = user.birth.getDate() + "/" + (user.birth.getMonth()+1) + "/" + user.birth.getFullYear()
    return response.render('info_perso', { userPrenom : user.firstname, userNom : user.lastname, userBirth : format_day, userEmail : user.email, userPermis : user.permissionId, userMobile : user.mobile, userAdresse : user.address });
  }

  @Post('changer_info')
  @UseGuards(AuthGuard())
  public async changer_info(@Usr() user : User,
  @Body() body : {old_mdp : string , new_mdp : string, check_mdp : string},
    @Response() response
  ) : Promise<any>
  {
    console.log('old mdp : ', body.old_mdp)
    console.log('mdp in bd :', user.password)
  
    // console.log("changer mdp")  
    const statusCode = await this.dashboardService.setPassword(user, body.old_mdp, body.new_mdp, body.check_mdp);
    console.log('statusCode : ', statusCode)
    response.redirect('/dashboard/info_perso?status=' + statusCode);
  }

  @Post('changer_mobile')
  @UseGuards(AuthGuard())
  public async changer_mobile(@Usr() user : User,
  @Body() body : {mobile : string},
    @Response() response
  ) : Promise<any>
  {  
    const statusCode = await this.dashboardService.setMobile(user,body.mobile);

    response.redirect('/dashboard/info_perso?status=' + statusCode);
  }

  @Post('changer_adresse')
  @UseGuards(AuthGuard())
  public async changer_adresse(@Usr() user : User,
  @Body() body : {adresse : string},
    @Response() response
  ) : Promise<any>
  {  
    this.dashboardService.setAdresse(user,body.adresse);

    response.redirect('/dashboard/info_perso')
  }

  @Get('my_quotes')
  @UseGuards(AuthGuard())
  public async my_quotes(@Usr() user : User, @Response() response) : Promise<any>
  {
    const myquotes = await this.dashboardService.getQuotes(user);
    
    return response.render('my_quotes',{userQuotes : myquotes});
  }

  @Get('info_quote')
  @UseGuards(AuthGuard())
  //@Render('info_quote')
  public async infoQuotePage(@Usr() user : User, @Query() query: { id: number}, @Response() response) :Promise<any>
  {
    const quoteInfo = await this.dashboardService.getQuoteInfo(user, query.id);
    return response.render('info_quote',{info : quoteInfo, quote_id : query.id});;
  }

  @Post('payment')
  @UseGuards(AuthGuard())
  public async payment(@Usr() user : User, @Query() query: { id: number}, @Response() response) :Promise<any>
  {
    const price = await this.dashboardService.getQuotePrice(query.id);
    let exp_date = "";
    if(user.expire_date){
      //longeur de month doit être 2
      const month = (Array(2).join('0') + (user.birth.getMonth()+1)).slice(-2);
      exp_date = user.expire_date.getFullYear() + "-" + month;
      console.log(exp_date);
    }
    return response.render('payment',{quoteId: query.id,quotePrice: price,firstName: user.firstname, lastName: user.lastname, cardNumber: user.card_number, cardExp_date: exp_date, cardCvv: user.cvv});
  }

  @Post('check_payment')
  @UseGuards(AuthGuard())
  public async savePayInfo(@Usr() user : User, @Body() body : { card_number : string, exp_date : Date, sec_number : number, nb_instal : number}, @Query() query: { id: number}, @Response() response):Promise<any>{
    
    // var Luhn = require('luhn-js');
    // var isCardValid = Luhn.isValid(body.card_number);
    // console.log("iscardvalide",isCardValid)
    // if (isCardValid==false){
    //   let statusCode = PaymentResponse.NUMBER_NO_MATCH
    //   console.log("query.id : ", query.id)
    //   // return response.redirect('/dashboard/payment?id=' + query.id+ '&status='+statusCode);
    //   return response.redirect('/dashboard/payment?status='+statusCode);
    // }
    
    
    await this.dashboardService.setCardInfo(user, body.card_number, body.exp_date, body.sec_number);

    //create bills
    const bills = await this.dashboardService.createBills(body.nb_instal, query.id);
    const contract = await this.contractService.creatContract(query.id, bills)
    const quoteInfo = await this.dashboardService.getQuoteInfo(user, query.id);
    let startDate = contract.bills[0].paid_date.getDate() + "/" + (contract.bills[0].paid_date.getMonth()+1) + "/" + contract.bills[0].paid_date.getFullYear()
    let endDate = contract.bills[0].paid_date.getDate() + "/" + (contract.bills[0].paid_date.getMonth()+1) + "/" + (contract.bills[0].paid_date.getFullYear()+1)
    console.log(contract)
    this.dashboardService.deleteQuote(query.id);
    return response.render('info_contract', {all_bill: bills, info: quoteInfo, startday: startDate, endday: endDate});
  }


  @Get('my_contracts')
  @UseGuards(AuthGuard())
  public async my_contracts(@Usr() user : User, @Response() response) : Promise<any>
  {
    const mycontracts = await this.dashboardService.getContracts(user);
    
    return response.render('my_contracts',{userContracts : mycontracts});
  }

  @Get('info_contract')
  @UseGuards(AuthGuard())
  public async infoContractPage(@Usr() user : User, @Query() query: { id: number}, @Response() response) :Promise<any>
  {
    const contractInfo = await this.contractService.getContractInfo(query.id);
    let cInfo = contractInfo.slice(0,-2);
    let start = contractInfo.at(-2);
    let end = contractInfo.at(-1);
    return response.render('info_contract',{info: cInfo, startday: start , endday: end });;
  }


  @Get('damage-claim')
  @UseGuards(AuthGuard())
  public async damageClaim(@Usr() user : User, @Request() request, @Response() response ) :Promise<any>
  {
    return response.render('damage_claim', {firstName: user.firstname, lastName: user.lastname, userEmail: user.email, userPermiId: user.permissionId})
  }

  @Post('damage-claim-send')
  @UseGuards(AuthGuard())
  public async damageClaimSend(@Usr() user : User, @Request() request, @Response() response, 
  @Body() body : {	accident_date : Date, location : string, description : string, plate_number : string, contract_id:number, image_uploads:Buffer} ) :Promise<any>
  {

    const mycar = await this.dashboardService.getCar(user);
    // console.log("mycar : ", mycar)

    const statusCode = await this.dashboardService.damageClaim(user, body)
    console.log("res : ", statusCode)

    return response.redirect('/dashboard/damage-claim?status=' + statusCode);


    // return response.render('', {firstName: user.firstname, lastName: user.lastname, userEmail: user.email, userPermiId: user.permissionId})
  }
  
}
