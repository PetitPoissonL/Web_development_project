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

@Entity('bills')
export class Bill
{
  @PrimaryGeneratedColumn()
  id : number;
  
  // ManyToOne : 
  // insurance contains multiple intances of bill
  // but bill contain only one instance of insurance
  // One : insurance ; Many : bills
  @ManyToOne(() => Insurance, (insurance) => insurance.id)
  insurance : Insurance;

  // OneToOne : 
  // bill contains only one instance of paymen 
  // and payment contains only one instance of bill 
  // @OneToOne(() => Payment, (payment) => payment.id)
  // payment : Payment;

  // from quote.price
  // for 1 insurance, price_to_pay = quote.price(par mois)*3 / / *6 / *12
  // for 1 insurance de 1 an, price_to_pay = quote.price(par mois)*3 --> generate 4 bills
  // for 1 insurance de 1 an, price_to_pay = quote.price(par mois)*6 --> generate 2 bills
  // for 1 insurance de 1 an, price_to_pay = quote.price(par mois)*1 --> generate 1 bills
  @Column({ nullable : true, type: "integer"})
  price_to_pay : number;

  @Column({ nullable : true, type: "date" })
  creation_date : Date;

  // for each bill, will have a limite date to pay
  // for the first bill, the date will be current_date
  // no first payment, the reste of bills will be canclled
  @Column({ nullable : true, type: "date" })
  payment_limit_date : Date;


  @Column({ nullable : true, type: "bool" })
  pay_yet : boolean;

  //if pay_yet is T, save date of payment
  // @Column({ nullable : true, type: "integer" })
  // paid_date : number;
  @Column({ nullable : true, type: "date" })
  paid_date : Date;

  // @Column({ nullable : true, type: "varchar"})
  // pay_type : string; //visa, master, applepay etc

  // bill
  // (insuranceID 1, billID 1, today, today)
  // (insuranceID 1, billID 2, today, today+6m)


}