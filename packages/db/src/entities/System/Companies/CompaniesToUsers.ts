import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, type Relation,
} from "typeorm";
import {Companies} from "../Companies/Companies";
import {Users} from "../Users";


@Entity("companies_to_users", {schema: "public"})
@Index(['userId', 'companyId'], { unique: true })
export class CompaniesToUsers {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name: 'company_id'})
    companyId: string;

    @Column({name: 'user_id'})
    userId: string;

    @ManyToOne(() => Companies,
        company => company.companiesToUsers,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            createForeignKeyConstraints: true
        }
    )

    @JoinColumn([{
        name: "company_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: 'fk_companies_to_users_company_id',
    }])
    company: Relation<Companies>;

    @ManyToOne(() => Users,
        users => users.companiesToUsers,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            createForeignKeyConstraints: true
        }
    )
    @JoinColumn([{
        name: "user_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: 'fk_companies_to_users_user_id',
    }])
    user: Relation<Users>;

}
