import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
    type Relation
} from "typeorm";
import { Countries } from "./Countries";

@Entity("languages", { schema: "public" })
export class Languages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("character varying", {
    name: "native_name",
    nullable: true,
    length: 255,
  })
  nativeName: string | null;

  @Column("character varying", { name: "emoji", nullable: true, length: 255 })
  emoji: string | null;

  @Column("character varying", { name: "emojiu", nullable: true, length: 255 })
  emojiu: string | null;

  @Column("character varying", { name: "code", nullable: true, length: 255 })
  code: string | null;

  @OneToMany(() => Countries, (countries) => countries.language)
  countries: Relation<Countries[]>;
}
