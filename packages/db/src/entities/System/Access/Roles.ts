import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, Unique,
    type Relation
} from "typeorm";

import { Users } from "../Users";
import { Actions } from "./Actions";
import { RolesToActions } from "./RolesToActions";
import { UsersToRoles } from "./UsersToRoles";
import { Companies } from "../Companies/Companies";

@Unique("companies_company_name_constraint", ["company", "name"])
@Entity("roles", { schema: "public" })
export class Roles {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", { name: "name", length: 128 })
    name: string;

    @Column("text", { name: "description", nullable: true })
    description: string | null;


    // ========= Users to roles ========= //

    @OneToMany(() => UsersToRoles, (usersToRoles) => usersToRoles.role)
    usersToRoles: Relation<UsersToRoles[]>;

    @ManyToMany(() => Users,
        user => user.usersToRoles,
    )
    users: Relation<Users[]>;

    // ======== Roles to actions ======== //

    @OneToMany(() => RolesToActions, (rolesToActions) => rolesToActions.role)
    rolesToActions: RolesToActions[];

    @ManyToMany(() => Actions, action => action.roles)
    actions: Relation<Actions[]>;

    // =========== Companies =========== //

    @ManyToOne(() => Companies,
        (companies) => companies.roles, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            nullable: true,
        })
    @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
    company: Relation<Companies>;


}
