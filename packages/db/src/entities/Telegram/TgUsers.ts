import {
    Column,
    type Relation,
    Entity,
    Index,
    JoinColumn,
    OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne,
} from "typeorm";
import config from "@zerp/global-configs";
import { TgChats, TgMessages } from "@/entities";

import { Users } from "../System";

@Index("tg_users_pkey", ["id"], { unique: true })
@Index("idx_tg_users_user_id", ['userId'])
@Entity("tg_users", { schema: "public" })
export class TgUsers {
    @Column({
        type: "bigint",
        primary: true,
        unique: true,
    })
    id: string;

    @Column("boolean", {
        name: "is_bot",
        nullable: false,
        default: false,
    })
    isBot: boolean;

    @OneToMany(() => TgMessages, (messages) => messages.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    messages: Relation<TgMessages[]>;

    @OneToMany(() => TgChats, (chats) => chats.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    chats: Relation<TgChats[]>;

    @Column("character varying", { name: "first_name", nullable: true })
    firstName: string | null;

    @Column("character varying", { name: "last_name", nullable: true })
    lastName: string | null;

    @Column("character varying", { name: "username", nullable: true })
    username: string | null;

    @Column("character varying", {
        name: "type",
        nullable: true,
        default: "user",
    })
    type: string | null;

    @Column("character varying", { name: "language", nullable: true, default: "en" })
    language: string | null;

    @Column("character varying", { name: "status", nullable: true, default: "registerd" })
    status: string | null;

    @CreateDateColumn({
        type: "timestamp without time zone",
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    createdAt: Date | null;

    @UpdateDateColumn({
        type: "timestamp without time zone",
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    updatedAt: Date | null;

    @Column("uuid", { name: "user_id", nullable: false })
    userId: string;
    @OneToOne(() => Users, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false,
    })
    @JoinColumn([{
        name: "user_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_tg_users_users_id",
    }])
    user: Relation<Users>;

    // Self-referencing relationships
    @ManyToOne(() => TgUsers, (tgUser) => tgUser.referrals, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: true,
    })
    @JoinColumn([
        {
            name: "referrer_id",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_tg_users_referrer_id",
        },
    ])
    referrer: TgUsers | null;

    @OneToMany(() => TgUsers, (tgUser) => tgUser.referrer, {
        cascade: ["insert", "update"],
    })
    referrals: TgUsers[];

    public getPublicView() {
        return {
            id: this.id,
            isBot: this.isBot,
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            type: this.type,
            language: this.language,
            status: this.status,
            ...(this.user ? { user: this.user } : {}),
        };
    }

    public get sendLink() {
        return `https://t.me/${config.bot.username}/webapp?startapp=send&receiver=${this.id}`;
    }


    public get receiveData() {
        return {
            id: this.id,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            ...(this.user ? {
                user: {
                    phone: this.user.phone,
                    email: this.user.email,
                },
            } : {}),
        };
    }
}
