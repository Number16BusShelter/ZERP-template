import {
    Column,
    Entity,
    JoinColumn, JoinTable, ManyToMany,
    ManyToOne,
    OneToMany, PrimaryGeneratedColumn, type Relation,
} from "typeorm";

import { CompanyProfiles } from "./CompanyProfiles";
import Decimal from "decimal.js";
import { Currencies } from "../Geo/Currencies";
import { Roles } from "../Access/Roles";
import { Users } from "../Users";
import { DecimalTransformer } from "../../../utils";
import { CompaniesToUsers } from "./CompaniesToUsers";

@Entity("companies", { schema: "public" })
export class Companies {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", {
        name: "fb_id",
        nullable: true,
        length: 255,
    })
    fbId: string | null;

    @Column("character varying", { name: "namespace", nullable: true, length: 255 })
    namespace: string | null;

    @Column("character varying", { name: "status" })
    status: string;

    @Column("decimal", {
        name: "balance",
        nullable: true,
        precision: 18,
        scale: 8,
        default: 0,
        transformer: new DecimalTransformer(),
    })
    balance: Decimal | null;

    @ManyToOne(() => Currencies, (currencies) => currencies.countries, { eager: true })
    @JoinColumn([{ name: "currency_id", referencedColumnName: "id" }])
    currency: Relation<Currencies>;

    @ManyToOne(
        () => CompanyProfiles,
        (companyProfiles) => companyProfiles.companies,
    )
    @JoinColumn([{ name: "profile_id", referencedColumnName: "id" }])
    profile: Relation<CompanyProfiles>;

    @OneToMany(
        () => CompaniesToUsers,
        (companiesToUsers) => companiesToUsers.company,
    )
    companiesToUsers: CompaniesToUsers[];

    @OneToMany(() => Roles, (companyRoles) => companyRoles.company)
    roles: Relation<Roles[]>;

    @ManyToMany(() => Users,
        users => users.companies)
    @JoinTable({
        name: "companies_to_users",
        joinColumn: {
            name: "company_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        synchronize: false,
    })
    users: Relation<Users[]>;

}
