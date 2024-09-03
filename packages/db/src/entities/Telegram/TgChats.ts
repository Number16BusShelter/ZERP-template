import {
    Column,
    type Relation,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

import {TgUsers} from "./TgUsers";
import {TgMessages} from "./TgMessages";

@Index("tg_chats_pkey", ["id"], {unique: true})
@Entity("tg_chats", {schema: "public"})
export class TgChats {
    @Column({
        type: "bigint",
        primary: true,
        unique: true
    })
    id: string;

    @ManyToOne(() => TgUsers, (user) => user.messages, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{name: "tg_user_id", referencedColumnName: "id"}])
    user: Relation<TgUsers>;

    @OneToMany(() => TgMessages, (messages) => messages.chat)
    messages: Relation<TgMessages[]>;

    @Column("character varying", {name: "language", nullable: true, default: 'en'})
    language: string | null;

    @Column("character varying", {name: "title", nullable: true})
    title: string | null;

    // 'private', 'group', 'supergroup', 'channel'
    @Column("character varying", {name: "type", nullable: true})
    type: string | null;

    @Column("character varying", {name: "status", nullable: true, default: 'registerd'})
    status: string | null;

    @CreateDateColumn({
        type: "timestamp without time zone",
        name: "created_at",
        default: () =>  "CURRENT_TIMESTAMP(6)",
    })
    createdAt: Date | null;

    @UpdateDateColumn({
        type: "timestamp without time zone",
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    updatedAt: Date | null;
}
