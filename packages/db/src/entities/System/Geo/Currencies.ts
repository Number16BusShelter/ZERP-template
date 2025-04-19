import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
    type Relation
} from "typeorm";
import { Countries } from "./Countries";
import {Companies} from "../Companies/Companies";

@Entity("currencies", { schema: "public" })
export class Currencies {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", length: 3 })
  code: string;

  @Column("character varying", { name: "name", length: 255, nullable: true })
  name: string;

  @Column("character varying", { name: "symbol", length: 10, nullable: true })
  symbol: string;

  @Column("integer", { name: "minor_unit", nullable: true })
  minorUnit: number;

  @Column("numeric", { name: "exchange_rate", precision: 20, scale: 10, nullable: true })
  exchangeRate: string;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;

  @OneToMany(() => Countries, (countries) => countries.currency)
  countries: Relation<Countries[]>;

  @OneToMany(() => Companies, (company) => company.currency)
  companies: Relation<Companies[]>;

  get publicView() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      symbol: this.symbol,
      minorUnit: this.minorUnit,
      exchangeRate: this.exchangeRate,
      active: this.active,
    }
  }
}
