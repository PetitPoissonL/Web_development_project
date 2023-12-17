import { Entity, ManyToOne, OneToOne } from "typeorm";
import { Column } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

import { Insurance } from "./insurance.model";
// import { Payment } from "./payment.model";

// Exemple : 
// const car = new Car();
// car.user : User;

// const user = new User();
// user.cars : Car[] = []

@Entity('damage')
export class Damage
{
  @PrimaryGeneratedColumn()
  id : number;
  
  // ManyToOne : 
  // insurance contains multiple intances of bill
  // but bill contain only one instance of insurance
  // One : insurance ; Many : damage
  @ManyToOne(() => Insurance, (insurance) => insurance.id)
  insurance : Insurance;


  @Column({ nullable : true, type: "date" })
  accident_date : Date;

  @Column({ nullable : true, type: "varchar" })
  location : string;

  @Column({ nullable : true, type: "varchar" })
  description : string;

  @Column({ nullable: true, type: "bytea"})
  image_uploads : string;

  @Column({ nullable: true, type : "integer"})
  insuranceId : number;
}