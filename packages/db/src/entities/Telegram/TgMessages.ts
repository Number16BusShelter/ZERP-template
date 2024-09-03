import {
    Column,
    Entity,
    type Relation,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
} from "typeorm";
import {TgUsers} from "./TgUsers";
import {TgChats} from "./TgChats";
import {TgUpdates} from "./TgUpdates";

@Index("tg_messages_pkey", ["id"], {unique: true})
@Entity("tg_messages", {schema: "public"})
export class TgMessages {
    @Column({
        type: "bigint",
        primary: true,
        unique: true
    })
    id: string;

    @ManyToOne(() => TgUsers, (user) => user.messages, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{name: "tg_user_id", referencedColumnName: "id"}])
    user: Relation<TgUsers>;

    @ManyToOne(() => TgChats, (chat) => chat.messages, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{name: "tg_chat_id", referencedColumnName: "id"}])
    chat: Relation<TgChats>;

    @OneToMany(() => TgUpdates, (updates) => updates.message,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    updates: Relation<TgUpdates[]>;

    @CreateDateColumn({type: "timestamp", name: "date", nullable: true})
    date: Date | null;

    @Column({type: "jsonb", name: "raw", nullable: true})
    raw: any;

    @Column("character varying", {name: "text", nullable: true})
    text: string | null;

    @Column("character varying", {name: "type", nullable: true, default: 'user'})
    type: string | null;

}
