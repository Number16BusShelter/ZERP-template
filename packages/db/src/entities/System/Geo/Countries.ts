import "reflect-metadata";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    type Relation
} from "typeorm";
import { CompanyProfiles } from "../Companies/CompanyProfiles";
import { Users } from "../Users";
import { Cities } from "./Cities";
import { Currencies } from "./Currencies";
import { Languages } from "./Languages";

@Index("countries_external_id_key", ["externalId"], { unique: true })
@Entity("countries", { schema: "public" })
export class Countries {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("integer", { name: "external_id", nullable: true, unique: true })
    externalId: number | null;

    @Column("character varying", { name: "name", nullable: true, length: 255 })
    name: string | null;

    @Column("character varying", { name: "iso3", nullable: true, length: 31 })
    iso3: string | null;

    @Column("character varying", { name: "iso2", nullable: true, length: 31 })
    iso2: string | null;

    @Column("character varying", {
        name: "numeric_code",
        nullable: true,
        length: 31,
    })
    numericCode: string | null;

    @Column("character varying", { name: "capital", nullable: true, length: 255 })
    capital: string | null;

    @Column("character varying", {
        name: "currency_symbol",
        nullable: true,
        length: 255,
    })
    currencySymbol: string | null;

    @Column("character varying", { name: "tld", nullable: true, length: 31 })
    tld: string | null;

    @Column("character varying", { name: "native", nullable: true, length: 255 })
    native: string | null;

    @Column("character varying", { name: "region", nullable: true, length: 255 })
    region: string | null;

    @Column("character varying", {
        name: "subregion",
        nullable: true,
        length: 255,
    })
    subregion: string | null;

    @Column("jsonb", { name: "timezones", nullable: true })
    timezones: object | null;

    @Column("numeric", { name: "latitude", nullable: true })
    latitude: string | null;

    @Column("numeric", { name: "longitude", nullable: true })
    longitude: string | null;

    @Column("character varying", { name: "emoji", nullable: true, length: 63 })
    emoji: string | null;

    @Column("character varying", { name: "emojiu", nullable: true, length: 63 })
    emojiu: string | null;

    @Column("character varying", {
        name: "phone_code",
        nullable: true,
        length: 31,
    })
    phoneCode: string | null;

    @OneToMany(() => Cities, (cities) => cities.country)
    cities: Relation<Cities[]>;

    @OneToMany(() => CompanyProfiles, (companies) => companies.county)
    companies: Relation<CompanyProfiles[]>;

    @ManyToOne(() => Currencies, (currencies) => currencies.countries)
    @JoinColumn([{ name: "currency_id", referencedColumnName: "id" }])
    currency: Relation<Currencies>;

    @ManyToOne(() => Languages, (languages) => languages.countries)
    @JoinColumn([{ name: "language_id", referencedColumnName: "id" }])
    language: Relation<Languages>;

    @OneToMany(() => Users, (users) => users.country)
    users: Relation<Users[]>;
}
