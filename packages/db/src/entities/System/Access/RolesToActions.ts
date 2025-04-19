import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Roles } from "./Roles";
import { Actions } from "./Actions";

@Entity("roles_to_actions", { schema: "public" })
export class RolesToActions {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "action_id" })
    actionId: string;

    @Column({ name: "role_id" })
    roleId: string;

    @Column("boolean", {
        name: "enabled",
        nullable: true,
        default: () => "false",
    })
    enabled: boolean | null;

    @ManyToOne(
        () => Roles,
        role => role.rolesToActions,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            createForeignKeyConstraints: true,
        })
    @JoinColumn({
        name: "role_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_roles_to_actions_role_id",
    })
    role: Relation<Roles>;

    @ManyToOne(
        () => Actions,
        action => action.rolesToActions,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            createForeignKeyConstraints: true,
        })
    @JoinColumn({
        name: "action_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_roles_to_actions_action_id",
    })
    action: Relation<Actions>;
}
