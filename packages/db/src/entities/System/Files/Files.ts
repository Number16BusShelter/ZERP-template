import {
    Column, CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
    type Relation
} from "typeorm";


import {Users} from "../Users";
import {app as appConfig} from "@zerp/global-configs"

@Index("files_checksum_user_key", ["checksum", "user"], {unique: true})
// @Index("files_pkey", ["id"], {unique: true})
@Entity("files", {schema: "public"})
export class Files {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("character varying", {
        name: "location",
        nullable: true,
        // length: 255,
    })
    location: string | null;

    @Column("character varying", {
        name: "s3",
        nullable: true,
        // length: 255,
    })
    s3: string | null;

    @CreateDateColumn({type: "timestamp without time zone", name: "created_at", default: () => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date | null;

    @UpdateDateColumn({
        type: "timestamp without time zone",
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)"
    })
    updatedAt: Date | null;

    @Column("character varying", {name: "type", nullable: true, length: 64})
    type: string | null;

    @Column("character varying", {name: "name", nullable: true,
        // length: 255
    })
    name: string;

    @Column("character varying", {name: "original_name", nullable: true,
        // length: 255
    })
    originalName: string;

    @Column("character varying", {name: "sourceUrl", nullable: true,
        // length: 255
    })
    sourceUrl: string;

    @Column("character varying", {
        name: "extension",
        nullable: true,
        length: 255,
    })
    extension: string | null;

    @Column("character varying", {
        name: "mimetype",
        nullable: true,
        length: 255,
    })
    mimetype: string | null;

    @Column("character varying", {
        name: "checksum",
        nullable: true,
        unique: false,
        length: 1024,
    })
    checksum: string | null;

    @Column("jsonb", {name: "meta", nullable: true})
    meta: object | null;

    @Column("boolean", {
        name: "purgeable",
        nullable: false,
        default: () => "false",
    })
    purgeable: boolean;

    @Column("bigint", {name: "size", nullable: true})
    size: string;

    @Column("character varying", {
        name: "encryption",
        nullable: true,
        length: 64,
    })
    encryption: string | null;

    @Column("boolean", {
        name: "encrypted",
        nullable: true,
        default: () => "false",
    })
    encrypted: boolean | null;

    @Column("boolean", {
        name: "purgable",
        nullable: true,
        default: () => "false",
    })
    purgable: boolean | null;

    @Column("boolean", {
        name: "checked",
        nullable: true,
        default: () => "false",
    })
    checked: boolean | null;

    @ManyToOne(() => Users, (users) => users.files)
    @JoinColumn([{name: "user_id", referencedColumnName: "id"}])
    user: Relation<Users>;

    @OneToMany(() => Users, (users) => users.profileImage)
    profileImage: Relation<Users[]>;

    public getLink() {
        return `${appConfig.handle}/media/${this.id}`
    }
    // @OneToMany(
    //   () => PhotoToInspections,
    //   (photoToInspections) => photoToInspections.photo
    // )
    // photoToInspections: PhotoToInspections[];
}
