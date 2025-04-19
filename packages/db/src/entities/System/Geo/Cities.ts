import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    type Relation,
} from "typeorm";
import { Countries } from "./Countries";

@Index("cities_external_id_key", ["externalId"], { unique: true })
@Entity("cities", { schema: "public" })
export class Cities {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("integer", { name: "external_id", nullable: true, unique: true })
    externalId: number | null;

    @Column("character varying", { name: "name", nullable: true, length: 255 })
    name: string | null;

    @Column("integer", { name: "state_id", nullable: true })
    stateId: number | null;

    @Column("numeric", { name: "latitude", nullable: true })
    latitude: string | null;

    @Column("numeric", { name: "longitude", nullable: true })
    longitude: string | null;

    @Column("character varying", {
        name: "wiki_data_id",
        nullable: true,
        length: 255,
    })
    wikiDataId: string | null;

    @Column("character varying", {
        name: "country_code",
        nullable: true,
        length: 255,
    })
    countryCode: string | null;

    @Column("character varying", {
        name: "state_code",
        nullable: true,
        length: 255,
    })
    stateCode: string | null;

    @ManyToOne(() => Countries, (countries) => countries.cities)
    @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
    country: Relation<Countries>;

}
