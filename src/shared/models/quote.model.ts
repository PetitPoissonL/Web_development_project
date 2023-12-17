import { Entity, JoinColumn } from "typeorm";
import { Column } from "typeorm";
import { OneToMany, ManyToOne} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm";

import { Car } from "./car.model";
import { User } from "./user.model";

@Entity('quote')
export class Quote
{
  @PrimaryGeneratedColumn()
  id : number;

  // ManyToOne : 
  // user contains multiple intances of car, permission, quote
  // but car, permission, quote contain only one instance of user
  // One : user ; Many : cars, permissions; quotes

  @ManyToOne(() => User, (user) => user.id)
  //@ManyToOne(() => User, (user) => user.quotes)
  user : User;

  // ManyToOne : 
  // car contains multiple instances of insurance and quote
  // but insurance and quote contain only one instance of car
  // One : car; Many : insurance, quote
  @ManyToOne(() => Car, (car) => car.id)
  car : Car;

  @Column({ nullable : true, type : "integer" })
  price : number;

  @Column({ nullable : true, type : "integer" })
  payout_max : number;

  @Column({ nullable : true, type : "integer" })
  payout_min : number;


}