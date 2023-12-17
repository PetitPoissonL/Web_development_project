import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository, UpdateQueryBuilder } from 'typeorm';

import { User } from '../../shared/models/user.model';
import { Quote } from '../../shared/models/quote.model'; 
import { Car } from '../../shared/models/car.model';
import { Permission } from '../../shared/models/permission.model';
import { QuoteResponse } from '../../shared/enums/quote-response.enum';
import { QuoteBody } from '../../shared/types/quote.type';
import { QuoteTemporary } from '../../shared/models/quote_temporary.model';


@Injectable()
export class QuoteService {
	constructor(
			private readonly userService : UserService,
			
			@InjectRepository(QuoteTemporary) private quoteTempRepository : Repository<QuoteTemporary>,
			@InjectRepository(Quote) private quoteRepository : Repository<Quote>,
			@InjectRepository(User) private userRepository : Repository<User>,
			@InjectRepository(Car)  private carRepository : Repository<Car>,
			@InjectRepository(Permission) private permissionRepository : Repository<Permission>
	) {}
	
	private async permission_exist(permis_id : string) : Promise<boolean>
	{
		const permission : Permission | null = await this.permissionRepository.findOne({ 
			where : [
				{ id : permis_id }
			],
		});

		return permission ? true : false;
	}

	private async insertQuote(body:QuoteBody, user:User, car:Car):Promise<Quote>{
		
		// new quote
		let quote_ = new Quote();
		quote_.price = body.price;
		quote_.payout_max = body.payout_max;
		quote_.payout_min = body.payout_min;
		// jointure
		quote_.user = user; // quote_.user.id = user.id
		quote_.car  = car;  // quote.car.id = car.id pas possible car CAT n'existe pas!!!
		quote_ = await this.quoteRepository.save(quote_);
		console.log('update quote info successfully!')		
		return quote_	
	}

	private async insertCar(body:QuoteBody, user:User):Promise<Car>
	{
		// new car
		let car_ = new Car();
		car_.level = body.level_car;
		car_.color = body.color_car;
		car_.year = body.year_car;
		car_.km = body.km_car;
		car_.first_driving = body.first_driving;
		car_.use_for = body.usage_car;
		car_.energy = body.energy_car;
		car_.user = user;
				
		//redefine car
		car_ = await this.carRepository.save(car_); // insert + get generated id
		console.log('update car info successfully!')
		return car_
	}

	private async insertPermission(body:QuoteBody, user:User):Promise<User>
	{

		console.log('before insert user permission id', user.permissionId)
		
		// Create permission
		const permission = new Permission()
		permission.id    = body.id_permis; // permission number
		// error : permission.user.id = (await user).id;
		//permission.user  = user; // /!\ Can't be linked more than once
		permission.start = body.start_permis;
		permission.end   = body.end_permis;
		await this.permissionRepository.insert(permission);

		// Update user
		user.permissionId =  body.id_permis;
		user = await this.userRepository.save(user);
		console.log('update permission id', user.permissionId)

		return user;
	}

	// create new data for quote, car and permission
	public async createQuote(isAuthenticated : boolean, body : QuoteBody) : Promise<[QuoteResponse, number | null]>
	{
		let user = await this.userService.getUserByEmail(body.email);

		if (!user)
		{
			const permission_exist = await this.permission_exist(body.id_permis)

			if (permission_exist) {
				return [QuoteResponse.PERMISSION_ALREADY_EXISTS, null];
			}
			
			await this.saveTemporaryQuote(body.email, body);
			return [QuoteResponse.NOT_REGISTERED, null];
		}

		// user exists
		const permission_exist = await this.permission_exist(body.id_permis)
		// variable mais content est undefined
		let quote_ : Quote;
		let car_ : Car;

		if (user.permissionId === null && permission_exist === false)
			user = await this.insertPermission(body, user);

		if (user.permissionId !== body.id_permis)
			return [QuoteResponse.PERMISSION_ID_NO_MATCH, null]

		// insert car
		car_ = await this.insertCar(body, user)
		// insert quote
		quote_ = await this.insertQuote(body, user, car_)

		return isAuthenticated ? [QuoteResponse.REGISTERED_AND_AUTHENTICATED, quote_.id] : [QuoteResponse.REGISTERED_NOT_AUTHENTICATED, null]; 
	}

	public async checkAndInsertTemporaryQuote(userEmail: string) : Promise<void>
	{
		const temp = await this.quoteTempRepository.findOne({
			where : {
				userEmail : userEmail
			}
		});
		if (!temp)
			return;

		// found user.email in database, insert into user
		const body : QuoteBody = JSON.parse(temp.quoteBody);
		const [ quoteResponse, id ] = await this.createQuote(false, body);

		// delete temp data after user is registered and quote, car is created
		if (quoteResponse === QuoteResponse.SUCCESS)
			await this.quoteTempRepository.remove(temp)
	}

	public async saveTemporaryQuote(userEmail: string, body : QuoteBody) : Promise<void>
	{
		const tmp = new QuoteTemporary();
		tmp.userEmail = userEmail;
		tmp.quoteBody = JSON.stringify(body);
		await this.quoteTempRepository.save(tmp);
	}
}
