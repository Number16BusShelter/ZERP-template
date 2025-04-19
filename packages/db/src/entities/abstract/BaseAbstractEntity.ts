import { BaseEntity, Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import z, { ZodSchema, ZodTypeAny } from "zod";

@Entity()
export abstract class BaseAbstractEntity extends BaseEntity {
    @CreateDateColumn({
        type: "timestamp without time zone",
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP(6)",
        nullable: true,
    })
    createdAt: Date | null;

    @UpdateDateColumn({
        type: "timestamp without time zone",
        name: "updated_at",
        default: () => "CURRENT_TIMESTAMP(6)",
        nullable: true,
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    updatedAt: Date | null;

    @DeleteDateColumn({
        type: "timestamp without time zone",
        name: "deleted_at",
        nullable: true,
    })
    deletedAt: Date | null;

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    public getPublicView(
        {
            additionalFields = {},
            omitFields = [],
        }: {
            additionalFields?: Record<string, any>;
            omitFields?: string[];
        } = {}) {
        const publicView: Record<keyof this, any> = <Record<keyof this, any>>{};
        const columns = Object.keys(this);

        columns.map(column => {
            const value = this[column];
            if (Array.isArray(value)) {
                publicView[column] = value.map(item => item?.getPublicView ? item.getPublicView() : item);
            } else if (!(omitFields.includes(column))) {
                if (value === undefined || value === null) {
                    publicView[column] = null;
                } else {
                    switch (typeof value) {
                        case "object":
                            // Special type handling
                            if (value instanceof Date) {
                                publicView[column] = value.getTime();
                            } else if (value.getPublicView) {
                                publicView[column] = value.getPublicView();
                            } else {
                                publicView[column] = value;
                            }
                            break;
                        default:
                            publicView[column] = value;
                    }
                }
            }
        });

        return {
            ...publicView,
            ...additionalFields,
        };
    }

    public getZodSchema(): ZodSchema {
        const schema: Record<string, ZodTypeAny> = {};
        const columns = Object.keys(this);

        for (const column of columns) {
            const value = (this as any)[column];
            if (Array.isArray(value)) {
                schema[column] = z.array(value[0]?.getZodSchema ? value[0].getZodSchema() : z.any());
            } else if (value && typeof value === "object" && value.getZodSchema) {
                schema[column] = value.getZodSchema();
            } else {
                schema[column] = this.getZodType(value);
            }
        }

        return z.object(schema);
    }

    private getZodType(value: any): ZodTypeAny {
        if (value === null || value === undefined) {
            return z.any();
        }
        switch (typeof value) {
            case "string":
                return z.string();
            case "number":
                return z.number();
            case "boolean":
                return z.boolean();
            case "object":
                if (value instanceof Date) {
                    return z.date();
                }
                return z.object({});
            default:
                return z.any();
        }
    }
}

