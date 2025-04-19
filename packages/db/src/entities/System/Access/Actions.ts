import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, type Relation } from "typeorm";
import { Roles } from "./Roles";
import { RolesToActions } from "./RolesToActions";
import { Scope } from "eslint";

@Unique("actions_name_type_constraint", ["type", "name"])
@Entity("actions", { schema: "public" })
export class Actions {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", {
        name: "type",
        nullable: false,
        length: 64,
        unique: false,
        // enum: ['system', 'company'],
        default: "system",
    })
    type: string;

    @Column("character varying", {
        name: "name",
        nullable: false,
        length: 128,
        // unique: true,
    })
    name: string;

    @Column("character varying", {
        name: "description",
        nullable: true,
        length: 256,
        unique: false,
    })
    description: string | null;

    @Column("boolean", { name: "enabled", default: true })
    enabled: boolean;

    // ======== Roles to actions ======== //

    @ManyToMany(() => Roles, role => role.actions)
    @JoinTable(
        {
            name: "roles_to_actions",
            joinColumn: {
                name: "action_id",
                referencedColumnName: "id",
                foreignKeyConstraintName: "fk_roles_to_actions_action_id",
            },
            inverseJoinColumn: {
                name: "role_id",
                referencedColumnName: "id",
                foreignKeyConstraintName: "fk_roles_to_actions_role_id",
            },
            synchronize: false,
        },
    )
    roles: Roles[];

    @OneToMany(() => RolesToActions, (rolesToActions) => rolesToActions.action)
    rolesToActions: Relation<RolesToActions>[];
}
