import { Entity, PrimaryColumn } from "typeorm";
import { Column } from "typeorm";


@Entity('quote_temporary')
export class QuoteTemporary
{
  @PrimaryColumn({ nullable : false })
  userEmail : string;

  @Column({ nullable : false, type : 'text'})
  quoteBody : string;

}
