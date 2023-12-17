import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quote } from '../../shared/models/quote.model'; 
import { Insurance } from '../../shared/models/insurance.model'
import { Bill } from '../../shared/models/bill.model';
import { elementAt } from 'rxjs';
import { getDateFormat } from '../../common/helper/env.helper';
import { Car } from '../../shared/models/car.model';
import { Permission } from '../../shared/models/permission.model';

@Injectable()
export class ContractService {
	constructor(
		@InjectRepository(Insurance) private contractRepository : Repository<Insurance>,
		@InjectRepository(Quote) private quoteRepository : Repository<Quote>,
		@InjectRepository(Car) private carRepository : Repository<Car>,
		@InjectRepository(Permission) private permissionRepository : Repository<Permission>
	){}

	public async creatContract(quoteID: number, bill:Bill[]):Promise<Insurance>
	{
		let contract = new Insurance
		const quote = await this.quoteRepository.findOne({ 
			relations: ["car"] ,
			where : {id : quoteID}
		});
		contract.car = quote.car
		console.log("quote's carId : ", quote.car.id);
		contract.bills = bill
		contract.start = bill[0].paid_date
		contract.payout_max = quote.payout_max
		contract.payout_min = quote.payout_min
		contract.bill_paid_index = 0
		if(bill.length>1){
			contract.end = bill[1].payment_limit_date
		}else{
			contract.end = new Date();
			contract.end.setMonth(contract.start.getMonth()+12);
		}
		contract.price = quote.price

		await this.contractRepository.save(contract)
		return contract
	}

	public async getContractInfo(contract_id: number) : Promise<string[]>
	{
		const res = [];
		const quote = await this.contractRepository.findOne({ 
		relations: ["car"] ,
		where : {id : contract_id}
		});
		const car = await this.carRepository.findOne({
			relations: ["user"] ,
			where : {id : quote.car.id}
		})
		const permission = await this.permissionRepository.findOne({
		where: {id : car.user.permissionId.toString()}
		})

		res.push(quote.price);
		res.push(quote.payout_max);
		res.push(quote.payout_min);
		res.push(getDateFormat(car.first_driving));
		res.push(car.year);
		res.push(car.level);
		switch (car.energy){
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
		res.push(car.color);
		switch (car.use_for){
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
		res.push(car.km);
		res.push(getDateFormat(car.user.birth));
		res.push(getDateFormat(permission.start));
		res.push(getDateFormat(permission.end));
		res.push(permission.id);
		res.push(car.user.firstname + " " + car.user.lastname);
		res.push(car.user.email);
		res.push(car.user.address);
		res.push(getDateFormat(quote.start));
		res.push(getDateFormat(quote.end));
		return res;
	}

}