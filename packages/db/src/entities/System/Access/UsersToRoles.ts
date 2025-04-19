import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Users } from "../Users";
import { Roles } from "./Roles";

// @Index("tariffs_to_options_pkey", ["id"], { unique: true })
@Entity("users_to_roles", { schema: "public" })
@Index(["userId", "roleId"], { unique: true })
export class UsersToRoles {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "user_id" })
    userId: string;

    @Column({ name: "role_id" })
    roleId: string;

    @ManyToOne(
        () => Users,
        user => user.usersToRoles,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            createForeignKeyConstraints: true,
        },
    )
    @JoinColumn([{
        name: "user_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_users_to_roles_user_id",
    }])
    user: Relation<Users>;

    @ManyToOne(
        () => Roles,
        role => role.usersToRoles,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            createForeignKeyConstraints: true,
        },
    )
    @JoinColumn([{
        name: "role_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_users_to_roles_role_id",
    }])
    role: Relation<Roles>;
}
