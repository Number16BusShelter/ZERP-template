import {
    Column,
    Entity,
    Index,
    JoinColumn, ManyToOne,
    type Relation,
} from "typeorm";

import { TgMessages } from "./TgMessages";

@Index("tg_update_pkey", ["id"], {unique: true})
@Entity("tg_update", {schema: "public"})
export class TgUpdates {
    @Column({
        type: "bigint",
        primary: true,
        unique: true
    })
    id: string;

    @ManyToOne(() => TgMessages, (message) => message.updates, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{name: "tg_message_id", referencedColumnName: "id"}])
    message: Relation<TgMessages>;

    @Column("character varying", {name: "type", nullable: true})
    type: string | null;


}
