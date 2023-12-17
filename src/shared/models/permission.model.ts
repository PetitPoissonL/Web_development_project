import { Entity } from "typeorm";
import { Column } from "typeorm";
import { OneToOne } from "typeorm";
import { PrimaryColumn } from "typeorm";

import { User } from './user.model'

@Entity('permissions')
export class Permission
{
 
  @PrimaryColumn({ type : "varchar"})
  id : string;

  // OneToOne : 
  // user contains one intances of permission
  // and permission contain only one instance of user
  // One : user ; One : permission
  // @OneToOne(() => User, (user) => user.id)
  // user : User;

  @Column({ nullable : true, type : "timestamp without time zone" })
  start : Date;
  
  @Column({ nullable : true, type : "timestamp without time zone" })
  end : Date;
  
}
