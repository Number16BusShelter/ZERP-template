import {
    Column,
    Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    type Relation
} from "typeorm";
import { TgUsers, AuthTokens, TonConnectSessions, Addresses } from "../";

import { BaseAbstractEntity } from "../abstract/BaseAbstractEntity";
import { UsersToRoles } from "./Access/UsersToRoles";
import { Roles } from "./Access/Roles";
import { Actions } from "./Access/Actions";
import { Countries } from "./Geo/Countries";
import { Files } from "./Files/Files";
import { CompaniesToUsers } from "./Companies/CompaniesToUsers";
import { Companies } from "./Companies/Companies";


@Index("idx_users_active_session_address_id", ["activeSessionAddressId"])
@Index("idx_users_id", ["id"])
@Entity("users", { schema: "public" })
export class Users extends BaseAbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", { name: "phone", nullable: true, length: 255 })
    phone?: string | null;

    @Column("character varying", { name: "email", nullable: true })
    email?: string | null;

    @Column("character varying", { name: "status", default: "new" })
    status: string;

    @Column("timestamp without time zone", { name: "last_seen", nullable: true })
    lastSeen: Date | null;

    @Column("boolean", { name: "on_boarding_complete", nullable: false, default: false })
    onBoardingComplete: boolean;

    @OneToOne(() => TonConnectSessions, (tonSession) => tonSession.user, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    tonConnectSession: Relation<TonConnectSessions>;

    @OneToOne(() => TgUsers, (tgUser) => tgUser.user, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    tgUser: Relation<TgUsers>;

    @Column({ type: "uuid", name: "active_session_address_id", default: null })
    activeSessionAddressId: string;
    @OneToOne(() => Addresses, (address) => address.user, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{
        name: "active_session_address_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_active_session_address",
    }])
    activeSessionAddress: Relation<Addresses>;

    @OneToMany(() => Addresses, (address) => address.user)
    addresses: Relation<Addresses[]>;

    @Column("character varying", { name: "language", nullable: true, length: 64, default: "en" })
    language: string | null;
    @ManyToOne(() => Countries, (countries) => countries.users)
    @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
    country: Relation<Countries>;

    @ManyToOne(() => Files, (files) => files.profileImage)
    @JoinColumn([{ name: "profile_image", referencedColumnName: "id" }])
    profileImage: Relation<Files>;


    @OneToMany(() => Files, (files) => files.user)
    files: Relation<Files[]>;


    @OneToMany(() => AuthTokens, (authRecord) => authRecord.user)
    public authTokens: Relation<AuthTokens[]>;

    // ========= B2B control ========= //

    @OneToMany(
        () => CompaniesToUsers,
        (companiesToUsers) => companiesToUsers.user,
    )
    companiesToUsers: Relation<CompaniesToUsers[]>;

    @ManyToMany(() => Companies, company => company.companiesToUsers)
    companies: Relation<Companies[]>;

    // ========= Users to roles ========= //

    @OneToMany(() => UsersToRoles, (usersToRoles) => usersToRoles.user)
    usersToRoles: Relation<UsersToRoles[]>;

    @ManyToMany(() => Roles, (role) => role.usersToRoles)
    @JoinTable({
        name: "users_to_roles",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_users_to_roles_user_id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_roles_to_actions_role_id",
        },
        synchronize: false,
    })
    roles: Relation<Roles[]>;

    public get actions(): Actions[] {
        return this.roles?.flatMap(role => role.actions);
    }

    public getPublicView() {
        return {
            id: this.id,
            phone: this.phone,
            email: this.email,
            status: this.status,
            lastSeen: this.lastSeen?.getTime(),
            onBoardingComplete: this.onBoardingComplete,
            tonConnectSession: this.tonConnectSession,
            ...(this.tgUser ? { tgUser: this.tgUser.getPublicView() } : { tgUser: undefined }),
            ...(this.activeSessionAddress ? { activeSessionAddress: this.activeSessionAddress.getPublicView() } : {}),
            ...(this.addresses ? { addresses: this.addresses.map(t => t.getPublicView()) } : {}),
        };
    }

}
