import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
} from "typeorm";
import type {
    Relation,
} from "typeorm";
import { Users } from "../Users";
import { BaseAbstractEntity } from "../../abstract/BaseAbstractEntity";

@Entity({ name: "auth_tokens" }) // Define the table name
export class AuthTokens extends BaseAbstractEntity{
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ type: "varchar", length: 255, nullable: true, default: "api_token" })
    public type?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    public name?: string;

    @Column({ type: "text", nullable: true })
    public description?: string;

    @Column({ type: "boolean", default: true })
    public isActive: boolean;

    @Column({ type: "text" })
    public hash: string;

    @Column({ type: "timestamp", nullable: true })
    public validUntil: Date;

    @Column({ type: "timestamp", nullable: true })
    public lastUsedAt?: Date;

    @ManyToOne(() => Users, (user) => user.authTokens, {
        onDelete: "CASCADE",
        eager: true,
        nullable: true,
    })
    public user: Relation<Users>;
}
