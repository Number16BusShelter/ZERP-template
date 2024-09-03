import {
    Column, CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    Unique, UpdateDateColumn,
} from "typeorm";
import { Users } from "@/entities/System";

@Index("ton_connect_sessions_pkey", ["userId"], { unique: true })
@Unique("ton_connect_sessions__user_id__key_qkey", ["userId", "key"])
@Entity("ton_connect_sessions", { schema: "public" })
export class TonConnectSessions {
    @PrimaryColumn({ type: "uuid", name: "user_id" })
    userId: string;

    @OneToOne(() => Users, (user) => user.tonConnectSession, {
        nullable: false,
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{
        name: "user_id", referencedColumnName: "id",
    }])
    user: Users;

    @Column("character varying", { name: "key", nullable: false, unique: false })
    key: string;

    @Column("character varying", { name: "session", nullable: false })
    session: string;

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

}
