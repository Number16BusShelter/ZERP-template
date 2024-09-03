import {
    Entity, PrimaryGeneratedColumn,
    Column, ManyToOne,
    JoinColumn, Index,
} from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Users } from "../System";

// import {Transaction} from "./Transaction";
// import { Address2Network } from "./Address2Network"
// import {Network} from "./Network";
// import {EventLog} from "./EventLog";
// import {Block} from "./Block";

// @Unique(
//     "addresses_address_user_id_uniq",
//     ["address", "user"]
// )
@Index("idx_addresses_user_id", ["userId"])
@Entity("addresses", { schema: "public" })
export class Addresses {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", {
        name: "address",
        unique: true,
    })
    address: string;

    @Column("character varying", {
        name: "public_key",
        unique: false,
        nullable: true,
    })
    publicKey: string;

    @Column("character varying", {
        name: "format",
        nullable: true,
    })
    format: string | null;

    @Column("character varying", {
        name: "encoding",
        nullable: true,
    })
    encoding: string | null;

    @Column("character varying", {
        name: "type",
        nullable: true,
    })
    type: string | null;

    @CreateDateColumn({
        name: "last_sync",
        nullable: true,
        default: null,
    })
    lastSync: Date | null;

    @Column("uuid", { name: "user_id", nullable: true })
    userId: string;
    @ManyToOne(() => Users, (user) => user.tonConnectSession, {
        nullable: true,
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{
        name: "user_id",
        referencedColumnName: "id",

    }])
    user: Users;

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

    public getPublicView() {
        return {
            id: this.id,
            address: this.address,
            publicKey: this.publicKey,
            encoding: this.encoding,
            type: this.type,
            ...(this.user ? { user: this.user.getPublicView() } : {}),
            createdAt: this.createdAt!.getTime(),
            updatedAt: this.updatedAt!.getTime(),
        };
    }

    // @Column("integer", {name: "network_id", nullable: true, unique: true})
    // networkId: number | null;

    // @OneToMany(
    //     () => Transaction,
    //     (Transaction) => Transaction.fromAddress
    // )
    // outgoingTransactions: Transaction[];
    //
    // @OneToMany(
    //     () => Transaction,
    //     (Transaction) => Transaction.toAddress
    // )
    // incomingTransactions: Transaction[];
    //
    // @OneToMany(
    //     () => Transaction,
    //     (Transaction) => Transaction.walletAddress
    // )
    // walletTransactions: Transaction[];

    // @OneToMany(type => Address2Network, a2n => a2n.address)
    // addressNetworks: Address2Network[];

    // @ManyToMany(type => Network, network => network.address)
    // @JoinTable({
    //     name: 'address_2_network',
    //     joinColumn: {
    //         name: 'address_id',
    //         referencedColumnName: 'id',
    //     },
    //     inverseJoinColumn: {
    //         name: 'network_id',
    //         referencedColumnName: 'id',
    //     },
    // })
    // networks: Network[]

}
