// Nest modules
import { Injectable, UploadedFile }            from '@nestjs/common';
import { InjectRepository }      from '@nestjs/typeorm';

import { DamageBody } from '../../shared/types/damage.type';

// External modules
import * as bcrypt               from 'bcrypt';
import { Repository }            from 'typeorm';
import { User }                  from '../../shared/models/user.model';
import { Quote } from '../../shared/models/quote.model';
import { Permission } from '../../shared/models/permission.model';
import { getDateFormat } from '../../common/helper/env.helper';

import { InfoPersoReponse } from '../../shared/enums/perso-info-response.enum';
import { Bill } from '../../shared/models/bill.model';
import { Insurance } from '../../shared/models/insurance.model';
import { Car } from '../../shared/models/car.model';
import { Damage } from 'src/shared/models/damage_report.model';

@Injectable()
export class DashboardService
{
  constructor
  (
    @InjectRepository(Quote) private quoteRepository : Repository<Quote>,
    @InjectRepository(User) private userRepository : Repository<User>,
    @InjectRepository(Permission) private permissionRepository : Repository<Permission>,
    @InjectRepository(Bill) private billRepository : Repository<Bill>,
    @InjectRepository(Insurance) private insuranceRepository : Repository<Insurance>,
    @InjectRepository(Car) private carRepository : Repository<Car>,
    @InjectRepository(Damage) private damageRepository : Repository<Damage>,

    
  )
  {}

  public async setPassword(user : User, old_mdp : string, new_mdp : string, check_mdp : string) : Promise<InfoPersoReponse>
  {
    const pwdMatch = bcrypt.compareSync(old_mdp, user.password);
    if (!pwdMatch)
    {
      console.log("mdp est incorrect")
      return InfoPersoReponse.PASSWORD_NO_MATCH
    }

    if (new_mdp!=check_mdp){
      console.log("mdp saisir n'est pas la même")
      return InfoPersoReponse.NEW_PASSWORD_NO_MATCH;
    }

    const hash = await bcrypt.hash(new_mdp, 10);
    //mise à jour le nouveau mot de passe
    await this.userRepository.update({
      id : user.id,
    },{
      password : hash,
    });

    return InfoPersoReponse.PASSWORD_CHANGED_SUCCESS;
  }

  public async setMobile(user : User, mobile : string) : Promise<InfoPersoReponse>
  {
    var myreg = /^[0][0-9]{9}$/;
    if (!myreg.test(mobile)) {
      console.log("Le format de mobile est incorrect!")
      //return 4;
      return InfoPersoReponse.MOBILE_NO_MATCH_FORMAT;
    } else {
      console.log("mobile est changé")
      //mise à jour le nouveau numéro de téléphone
      await this.userRepository.update({
        id : user.id,
      },{
        mobile : mobile,
      });
      return InfoPersoReponse.MOBILE_CHANGED_SUCCESS;
    }
  }

  public async setAdresse(user : User, adresse : string) : Promise<void>
  {
    //mise à jour le nouvel adresse
    await this.userRepository.update({
      id : user.id,
    },{
      address : adresse,
    });
  }

  public async getQuotes(user : User) : Promise<string[][]>
  {
    const res = [];
    //trouver tous les quotes d'utilisateur
    const quotes = await this.quoteRepository.find({ 
      select: ['id', 'price', 'payout_max', 'payout_min'],
      relations: ["user", "car"] ,
      where : {user: {id : user.id}}
    });

    for (var i=0; i<quotes.length; i++){
      const quote = [];
      quote.push(quotes[i].id);
      quote.push(quotes[i].car.level);
      quote.push(quotes[i].price);
      quote.push(quotes[i].payout_max);
      quote.push(quotes[i].payout_min);
      
      res.push(quote);
    }
    return res
  }

  public async getQuoteInfo(user : User, quote_id: number) : Promise<string[]>
  {
    const res = [];
    const quote = await this.quoteRepository.findOne({ 
      relations: ["user", "car"] ,
      where : {id : quote_id}
    });
    const permission = await this.permissionRepository.findOne({
      where: {id : user.permissionId.toString()}
    })

    res.push(quote.price);
    res.push(quote.payout_max);
    res.push(quote.payout_min);
    res.push(getDateFormat(quote.car.first_driving));
    res.push(quote.car.year);
    res.push(quote.car.level);
    switch (quote.car.energy){
      case 1:
        res.push("DIESEL");
        break;
      case 2:
        res.push("ESSENCE");
        break;
      case 3:
        res.push("HYBRIDE");
        break;
      case 4:
        res.push("ELECTRIQUE");
        break;
    }
    res.push(quote.car.color);
    switch (quote.car.use_for){
      case 1:
        res.push("Regular tours");
        break;
      case 2:
        res.push("Leisure & business");
        break;
      case 3:
        res.push("Leisure & work trips");
        break;
      case 4:
        res.push("Leisure exclusively");
        break;
    }
    res.push(quote.car.km);
    res.push(getDateFormat(user.birth));
    res.push(getDateFormat(permission.start));
    res.push(getDateFormat(permission.end));
    res.push(permission.id);
    res.push(user.firstname + " " + user.lastname);
    res.push(user.email);
    res.push(user.address);
    return res;
  }

  public async getQuotePrice(quote_id: number) : Promise<number>
  {
    const quote = await this.quoteRepository.findOne({ 
      where : {id : quote_id}
    });
    return quote.price*12;
  }

  public async setCardInfo(user : User, cardNumber : string, expiryDate: Date, securityNumber : number) : Promise<void>
  {
    //mise à jour l'info de la carte bancaire
    await this.userRepository.update({
      id : user.id,
    },{
      card_number : cardNumber,
      expire_date : expiryDate,
      cvv : securityNumber,
    });
  }

  //création des bills, le premier bill est payé par défaut
  public async createBills(quantity: number, quote_id: number) : Promise<Bill[]> {
    const quote = await this.quoteRepository.findOne({ 
      where : {id : quote_id}
    });
    const price = quote.price * 12;
    const bills = [];
    const bill_price = price/quantity;
    const bill = new Bill();
    bill.price_to_pay = bill_price;
    bill.creation_date = new Date();
    bill.payment_limit_date = new Date();
    bill.pay_yet = true;
    bill.paid_date = new Date();
    bills.push(bill);
    
    for (let i = 1; i < quantity; i++){
      const nextBill = new Bill();
      nextBill.price_to_pay = bill_price;
      nextBill.creation_date = new Date();
      nextBill.payment_limit_date = new Date();
      nextBill.payment_limit_date.setMonth(nextBill.creation_date.getMonth()+(i*12/quantity));
      nextBill.pay_yet = false;
      bills.push(nextBill);
    }
    this.billRepository.save(bills);
    return bills;
  }

  public async getCarContracts(mycar : Car) : Promise<string[][]>
  {
    const res = [];
    //trouver tous les contrats de voiture
    const contracts = await this.insuranceRepository.find({ 
      select: ['id', 'price', 'payout_max', 'payout_min'],
      relations: ["car"] ,
      where : {car: {id : mycar.id}}
    });

    for (var i=0; i<contracts.length; i++){
      const contract = [];
      contract.push(contracts[i].id);
      contract.push(contracts[i].car.level);
      contract.push(contracts[i].price);
      contract.push(contracts[i].payout_max);
      contract.push(contracts[i].payout_min);
      
      res.push(contract);
    }
    return res
  }

  public async getContracts(user : User) : Promise<string[][]>
  {
    const res = [];
    //trouver tous les contrats d'utilisateur
    //d'abord trouver tous les cars d'utilisateur
    const cars = await this.carRepository.find({ 
      relations: ["user"] ,
      where : {user: {id : user.id}}
    });

    for (var i=0; i<cars.length; i++){
      res.push.apply(res,this.getCarContracts(cars[i]));
      const car_contracts = await this.getCarContracts(cars[i]);
      for (let j of car_contracts){
        res.push(j);
      }
    }
    return res
  }

  public async deleteQuote(id: number) : Promise<void>
  {
    await this.quoteRepository.delete(id);
  }

  private async insertDamage(insuranceId : number, body:DamageBody, user:User):Promise<any>
	{
		// report damage
		let damage_ = new Damage();
    damage_.accident_date = body.accident_date;
    damage_.description = body.description;
    damage_.location = body.location;
    damage_.insuranceId = insuranceId;
    damage_.image_uploads = Buffer.from(body.image_uploads).toString('base64');

		damage_ = await this.damageRepository.save(damage_);
	}

  public async damageClaim(user : User, body : DamageBody) : Promise<InfoPersoReponse>
	{
    let plate_no_match = false;

    //list contain all the car of user 
    let car_ : Car[];
    car_ = await this.getCar(user)

    // update plate number in car
    for (let car of car_) {
      if (car.plate_number != null && car.plate_number != body.plate_number) {
        plate_no_match = true;
        break;
      }else{
        //update plate number for all cars of user
        await this.carRepository.update({ id : car.id },{ plate_number : body.plate_number });
        // console.log("update plate number ok !")
      }
   }

   if (plate_no_match == true) return InfoPersoReponse.PLATE_NUMBER_NO_MATCH

    // find insurance with body.plate_number
    const insuranceRelated = await this.insuranceRepository.findOne({ 
      relations: ['car'],
      where : [{car: {plate_number : body.plate_number}}]
    });

    if (insuranceRelated == null) {
      console.log("insurance found : ", insuranceRelated)
      return InfoPersoReponse.CONTTRACT_NO_EXIST
    }

    // create damage report request
    await this.insertDamage(insuranceRelated.id, body, user)

    // update sinistre in table user
    await this.userRepository.update({ id : user.id },{ sinistre : user.sinistre+1 });


    return InfoPersoReponse.DAMAGE_REPORT_SAVE 
  }

  public async getCar(user:User) : Promise <Array<Car>>
  {
    const car = await this.carRepository.find({
      select: ['id', 'plate_number'],
      relations: ["user"],
      where : {user: {id : user.id}}
    }); 
    return car
  }
}