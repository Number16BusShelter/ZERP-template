import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany, PrimaryGeneratedColumn,
    type Relation
} from "typeorm";
import { Companies } from "./Companies";
import { Countries } from "../Geo/Countries";

@Entity("company_profiles", { schema: "public" })
export class CompanyProfiles {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", { name: "name", nullable: true, length: 255 })
    name: string | null;

    @Column("character varying", {
        name: "director_name",
        nullable: true,
        length: 255,
    })
    directorName: string | null;

    @Column("character varying", {
        name: "address",
        nullable: true,
        length: 1024,
    })
    address: string | null;

    @Column("character varying", { name: "email", nullable: true, length: 255 })
    email: string | null;

    @Column("character varying", { name: "url", nullable: true, length: 255 })
    url: string | null;

    @Column("character varying", { name: "phone", nullable: true, length: 255 })
    phone: string | null;

    @OneToMany(() => Companies, (companies) => companies.profile)
    companies: Relation<Companies[]>;

    @ManyToOne(() => Countries, (countries) => countries.companies)
    @JoinColumn([{ name: "county_id", referencedColumnName: "id" }])
    county: Relation<Countries>;
}
