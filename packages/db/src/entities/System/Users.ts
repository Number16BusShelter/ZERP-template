import {
    Column,
    Entity, Index, JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { TgUsers, AuthTokens, TonConnectSessions, Addresses } from "@/entities";
import { BaseAbstractEntity } from "@/entities/BaseAbstractEntity";


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
    tonConnectSession: TonConnectSessions;

    @OneToOne(() => TgUsers, (tgUser) => tgUser.user, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    tgUser: TgUsers;

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
    activeSessionAddress: Addresses;

    @OneToMany(() => Addresses, (address) => address.user)
    addresses: Addresses[];

    @OneToMany(() => AuthTokens, (authRecord) => authRecord.user)
    public authTokens: AuthTokens[];

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
