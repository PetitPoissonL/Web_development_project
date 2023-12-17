import { Entity } from "typeorm";
import { Column } from "typeorm";
import { OneToMany, OneToOne, ManyToOne} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm";

import { Car } from "./car.model";
import { Bill } from "./bill.model";
import { Damage } from "./damage_report.model";


@Entity('insurances')
export class Insurance
{
  @PrimaryGeneratedColumn()
  id : number;
  
  // ManyToOne : 
  // car contains multiple instances of insurance
  // but insurance contain only one instance of car
  // One : car; Many : insurances
  @ManyToOne(() => Car, (car) => car.id)
  car : Car; 

  // OneToMany : 
  // insurance contains multiple intances of bill
  // but bill contain only one instance of insurance
  // One : insurance ; Many : bills
  @OneToMany(() => Bill, (bill) => bill.id)
  bills : Bill[]; 

  @OneToMany(() => Damage, (damage) => damage.id)
  damages : Damage[]; 

  @Column({ nullable : true, type : "timestamp without time zone" })
  start : Date;

  @Column({ nullable : true, type : "timestamp without time zone"})
  end : Date;

  // par mois
  @Column({ nullable : true, type : "integer" })
  price : number;

  @Column({ nullable : true, type : "integer" })
  payout_max : number;

  @Column({ nullable : true, type : "integer" })
  payout_min : number;

  @Column({ nullable : true, type : "integer"})
  bill_paid_index : number;

}