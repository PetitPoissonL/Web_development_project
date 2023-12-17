import { Entity, ManyToOne, OneToMany } from "typeorm";
import { Column } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.model";
import { Insurance } from "./insurance.model";
import { Quote } from "./quote.model";


// Exemple : 
// const car = new Car();
// car.user : User;

// const user = new User();
// user.cars : Car[] = []

@Entity('cars')
export class Car
{

  @PrimaryGeneratedColumn()
  id : number;

  // ManyToOne : 
  // user contains multiple intances of car, permission, quote
  // but car, permission, quote contain only one instance of user
  // One : user ; Many : cars, permissions; quotes
  @ManyToOne(() => User, (user) => user.id)
  user : User; // only one user, so user without s!

  // OneToMany : 
  // car contains multiple instances of insurance and quote
  // but insurance and quote contain only one instance of car
  // One : car; Many : insurance, quote
  @OneToMany(() => Insurance, (insurance) => insurance.id)
  insurances : Insurance[]; // can have many insurances for 1 car

  @OneToMany(() => Quote, (quote) => quote.id)
  quotes : Quote[];


  // preciser nullable : true manuellement, par default est true...
  @Column({ nullable : true, type: "integer"})
  level : number;

  @Column({ nullable : true, type : "varchar"})
  color : string;

  @Column({ nullable : true, type : "varchar" })
  year : string;

  @Column({ nullable : true, type : "integer" })
  km : number;
  
  // 第一次行駛日期 1e circulation
  // 購車日期
  @Column({ nullable : true, type : "timestamp without time zone"})
  first_driving : Date;

  //usage du vehicule
  @Column({ nullable : true, type : "integer"})
  use_for : number;

  //energie du vehicule
  @Column({ nullable : true, type : "integer"})
  energy : number;

  @Column({ nullable : true, type : "varchar"})
  plate_number : string;

}
