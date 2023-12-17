// import { Entity, ManyToOne, OneToOne } from "typeorm";
// import { Column } from "typeorm";
// import { PrimaryGeneratedColumn } from "typeorm";

// import { Bill } from "./bill.model";

// // Exemple : 
// // const car = new Car();
// // car.user : User;

// // const user = new User();
// // user.cars : Car[] = []

// @Entity('payments')
// export class Payment
// {
//   @PrimaryGeneratedColumn()
//   id : number;

//   // OneToOne : 
//   // bill contains only one instance of paymen 
//   // and payment contains only one instance of bill 
//   @OneToOne(() => Bill, (bill) => bill.id)
//   bill : Bill; // one payment mathc one payment

//   // preciser nullable : true manuellement, par default est true...


//   @Column({ nullable : true, type: "varchar"})
//   type : string;
  
//   // after insert into payment
//   // (paymID 1, bill 1, today, VISA)

// }