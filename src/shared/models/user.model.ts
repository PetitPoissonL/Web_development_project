import { Entity } from "typeorm";
import { Column } from "typeorm";
import { OneToMany, OneToOne} from "typeorm"
import { PrimaryGeneratedColumn, JoinColumn } from "typeorm";

import { Permission } from "./permission.model";
import { Car } from "./car.model"
import { Quote } from "./quote.model"


@Entity('users')
export class User
{
 
  @PrimaryGeneratedColumn()
  id : number;

  // OneToOne
  @OneToOne(() => Permission, (p) => p.id)
  @JoinColumn()
  permission : Permission; //for 1 user, we can have n permissions

  // OneToMany : 
  // user contains multiple intances of car, permission, quote
  // but car, permission, quote contain only one instance of user
  // One : user ; Many : cars, permissions; quotes
  @OneToMany(() => Car, (car) => car.id)
  cars : Car[]; //for 1 user, we can have n cars

  @OneToMany(() => Quote, (quote) => quote.id)
  //@OneToMany(() => Quote, (quote) => quote.user)
  quotes : Quote[]; //for 1 user, we can have n quotes

  // preciser nullable : true manuellement, par default est true...
  @Column({ nullable : true, type: "varchar", length : 255 })
  firstname : string;

  @Column({ nullable : false })
  password : string;

  @Column({ nullable : true })
  lastname : string | null;

  @Column({ nullable : true })
  mobile : string | null;

  @Column({ nullable : false })
  email : string;

  @Column({ nullable : true })
  address : string | null; 

  @Column({ nullable : true, type : "timestamp without time zone" })
  birth : Date | null;

  @Column({ nullable : true, type : "integer"})
  sinistre : number | null;

  @Column({ nullable : true, type : "integer"})
  question : number | null;

  @Column({ nullable : true, type : "varchar"})
  answer : string | null;

  // credit card info
  @Column({ nullable : true, type : "varchar"})
  card_number : string | null;

  // only month and year
  @Column({ nullable : true, type : "timestamp without time zone" })
  expire_date : Date | null;

  @Column({ nullable : true, type : "integer" })
  cvv : number | null;

  @Column({ nullable : true})
  permissionId : string | null;
  
}
// const permission = new Permission();
// permission.user.birth

// const user = new User();
// for (let permission of user.permissions)
// {
//   permission.start
// }
