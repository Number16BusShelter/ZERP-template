// controllers/BaseCRUDController.ts

import { Paginate } from "@zerp/types";
import { paginateResponse } from "@/queries";

import { FindOptionsWhere, FindOptionsOrder, FindManyOptions, Repository, FindOneOptions } from "typeorm";

import AppDataSource from "../../data-source";

export type FindOptionsOrID<T> = FindOptionsWhere<T> | FindOptionsWhere<T>[] | string | number

/**
 * Base class for CRUD controllers that handle common CRUD operations.
 * Provides generic CRUD (Create, Read, Update, Delete) operations for any given entity.
 * Uses TypeORM's Repository for database operations.
 *
 * @template T The entity type associated with the controller.
 */
export abstract class BaseCRUDController<T> {
    /**
     * The primary repository associated with the entity.
     */
    public primaryRepository: Repository<any>;

    /**
     * The primary entity constructor.
     */
    public primaryEntity: new () => T;

    /**
     * The default relations to be included when querying the entity.
     */
    public defaultRelations: string[] = [];

    /**
     * Creates an instance of BaseCRUDController.
     * @param entity The constructor of the primary entity associated with the controller.
     * @param defaultRelations An optional array of default relations to include when querying the entity.
     */
    protected constructor(entity: new () => T, defaultRelations?: string[]) {
        /**
         * The repository associated with the primary entity.
         */
        this.primaryRepository = AppDataSource.getRepository(entity);

        /**
         * The constructor of the primary entity.
         */
        this.primaryEntity = entity;

        /**
         * An array of default relations to be included when querying the entity.
         * If not provided, no default relations will be included.
         */
        this.defaultRelations = defaultRelations || [];
    }

    async getAll(findOptions: FindManyOptions<T>): Promise<T[]> {
        return this.primaryRepository.find(findOptions);
    }

    /**
     * Returns the repository for a specific relation.
     * @param relationName The name of the relation for which the repository is needed.
     * @returns The repository instance for the specified relation.
     */
    protected static getRepositoryForRelation(relationName: string): Repository<any> {
        // Replace this placeholder implementation with the actual logic to return the repository.
        // This method should return the appropriate repository instance based on the relationName.
        return AppDataSource.getRepository(relationName);
    }

    /**
     * Normalizes the find options by converting them to a consistent format.
     * @template I The type of the entity being queried.
     * @param options The find options or ID to be normalized.
     * @returns The normalized find options in the correct format.
     */
    protected normalizeFindOptions<I>(options: FindOptionsOrID<I>): FindOptionsWhere<I> | FindOptionsWhere<I>[] {
        // This method converts the find options or ID to a consistent format for querying.
        // If the options are already in the correct format, they are returned as is.
        // If the options are a string or number (representing an ID), they are converted to an object format.

        // @ts-ignore
        return (typeof options == "string" || typeof options == "number") ? { id: options } : options;
    }

    /**
     * Create a new entity.
     *
     * This method creates and saves a new entity in the database.
     *
     * @param data - The data for the new entity. Can be a subset of the entity's properties.
     * @returns The saved entity.
     * @throws Error if there is an issue with database insertion.
     */
    public async create(data: Partial<T>): Promise<T> {
        const newEntity = this.primaryRepository.create(data);
        return (await this.primaryRepository.save(newEntity)) as T;
    }

    /**
     * Create or Update an Entity.
     *
     * @param findOptions - Conditions to find an existing entity.
     * @param options - Data to create or update the entity.
     * @returns The created or updated entity.
     */
    // public async createOrUpdate(findOptions: FindOptionsOrID<T>, options: Partial<T>): Promise<T> {
    //     const entry = await this.primaryRepository.findOne({
    //         where: this.normalizeFindOptions<T>(findOptions)
    //     });
    //     if (!entry) {
    //         return this.primaryRepository.save(options);
    //     }
    //     return this.primaryRepository.save(Object.assign(entry, options));
    // }

    public async createOrUpdate(findOptions: FindOptionsOrID<T>, options: Partial<T>): Promise<T> {
        const existingEntity = await this.find(findOptions);

        if (existingEntity) {
            // Update the existing entity with the partial data
            return (await this.updatePartial(findOptions, options)) as T;
        } else {
            // Create a new entity
            return this.create(options);
        }
    }

    /**
     * Paginate Entities.
     *
     * @param take - Number of entities to fetch.
     * @param page - Page number.
     * @param search - Search conditions.
     * @param relations
     * @param order - Order conditions.
     * @param cache - Time in ms to cache the entities
     * @returns Paginated list of entities.
     */
    public async paginate(
        take: number = 10,
        page: number = 1,
        search: FindOptionsWhere<T> | FindOptionsWhere<T>[] | any = {},
        relations: string[] = this.defaultRelations,
        order?: FindOptionsOrder<T>,
        cache?: boolean | number | {
            id: any;
            milliseconds: number;
        },
    ): Promise<Paginate<T>> {
        const data = await this.primaryRepository.findAndCount({
            where: search,
            relations: relations,
            order: order,
            take: take,
            skip: (page - 1) * take,
            cache,
        });
        return paginateResponse(data, page, take);
    }

    /**
     * Save an Entity.
     *
     * @param options - Data of the entity to save.
     * @returns The saved entity.
     */
    public async save(options: Partial<T>): Promise<T> {
        return this.primaryRepository.save(options);
    }

    /**
     * Lists entities based on the provided conditions, relations, and options.
     *
     * @param options - Conditions to filter the entities.
     * @param relations - Relations to be included in the result.
     * @param additionalOptions - Additional options for the query.
     * @returns A promise that resolves to an array of entities or an empty array.
     */
    public async list(
        options: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {},
        relations = this.defaultRelations,
        additionalOptions?: Partial<FindOneOptions<T>>,
    ): Promise<T[] | []> {
        return this.primaryRepository.find({
            where: options,
            relations: relations,
            ...(additionalOptions ? additionalOptions : {}),
        });
    }

    /**
     * Find an Entity.
     *
     * @param options - Conditions to find an entity.
     * @param relations
     * @param additionalOptions
     * @returns The found entity or null.
     */
    public async find(
        options: FindOptionsOrID<T> | string | number,
        relations = this.defaultRelations,
        additionalOptions?: Partial<FindOneOptions<T>>,
    ): Promise<T | null> {
        return this.primaryRepository.findOne({
            where: this.normalizeFindOptions<T>(options),
            relations: relations,
            ...(additionalOptions ? additionalOptions : {}),
        });
    }

    /**
     * Get an Entity or throw an error if not found.
     *
     * @param options - Conditions to find an entity.
     * @param relations - Additional relations to be included in the result.
     * @param additionalOptions - Additional options for the query.
     * @param order - Order conditions for the result.
     * @returns The found entity.
     * @throws Error if entity is not found.
     */
    public async get(
        options: FindOptionsOrID<T> | string | number,
        relations = this.defaultRelations,
        additionalOptions?: Partial<FindOneOptions<T>>,
        order?: FindOptionsOrder<T>,
    ): Promise<T> {
        return this.primaryRepository.findOneOrFail({
            where: this.normalizeFindOptions<T>(options),
            relations: relations,
            ...(additionalOptions ? additionalOptions : {}),
            order,
        });
    }

    /**
     * Delete an Entity.
     *
     * @param options - Conditions to find the entity to delete.
     * @returns The deleted entity.
     */
    public async delete(options: FindOptionsOrID<T>): Promise<T> {
        const entity = await this.primaryRepository.findOneOrFail({
            where: this.normalizeFindOptions<T>(options),
        });
        return this.primaryRepository.remove(entity);
    }

    /**
     * Duplicate an Entity.
     *
     * @param options - Conditions to find the entity to delete.
     * @returns The duplicated entity.
     */
    public async duplicate(options: FindOptionsOrID<T>): Promise<T> {
        // Find the entity by ID
        const entity = await this.primaryRepository.findOneOrFail({
            where: this.normalizeFindOptions<T>(options),
        });

        // Create a new entity object
        const newEntity = this.primaryRepository.create(entity);

        // Save the new entity to the database
        return this.primaryRepository.save(newEntity);
    }

    /**
     * Soft delete an entity.
     *
     * This function sets the 'isDeleted' flag of an entity to true, which indicates
     * that the entity has been deleted without actually removing it from the database.
     *
     * @param options - Criteria to find the entity to soft delete.
     * @returns The updated (soft-deleted) entity.
     */
    public async softDelete(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T> {
        const entity = await this.get(options);
        // @ts-ignore
        // entity.isDeleted = true;
        // entity.deletedAt = new Date();
        return this.primaryRepository.save(entity);
    }

    /**
     * Restore a soft-deleted entity.
     *
     * This function sets the 'isDeleted' flag of an entity to false, which makes
     * the previously soft-deleted entity active again.
     *
     * @param options - Criteria to find the soft-deleted entity to restore.
     * @returns The restored entity.
     */
    public async restore(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T> {
        const entity = await this.get(options);
        // @ts-ignore
        entity.isDeleted = false;
        return this.primaryRepository.save(entity);
    }

    /**
     * Count entities based on certain criteria.
     *
     * This function counts the number of entities that match the given criteria.
     *
     * @param options - Conditions to count entities.
     * @returns The number of entities that match the criteria.
     */
    public async count(options: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {}): Promise<number> {
        return this.primaryRepository.count({ where: options });
    }

    /**
     * Insert multiple entities at once.
     *
     * This function performs a batch insert of multiple entities into the database.
     *
     * @param entities - Array of entities to insert.
     * @returns The inserted entities.
     */
    public async batchInsert(entities: T[]): Promise<T[]> {
        return this.primaryRepository.save(entities);
    }

    /**
     * Delete multiple entities based on criteria.
     *
     * This function deletes entities from the database that match the given criteria.
     *
     * @param criteria - Conditions to find the entities to delete.
     */
    public async batchDelete(criteria: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<void> {
        await this.primaryRepository.delete(criteria);
    }

    /**
     * Update specific fields of an entity based on criteria.
     * !!! DOES NOT CASCADE
     * Instead of updating the entire entity, this function updates specific fields.
     *
     * @param criteria - Conditions to find the entity to update.
     * @param partialEntity - Fields of the entity to update.
     * @returns The updated entity or null if not found.
     */
    public async updatePartial(criteria: FindOptionsOrID<T>, partialEntity: Partial<T>): Promise<T> {
        criteria = this.normalizeFindOptions(criteria);
        await this.primaryRepository.update(criteria, partialEntity);
        return this.get(criteria);
    }


    // TODO: !!!!!! UNDER CONSTRUCTION !!!!!!
    public async duplicateWithRelations(
        options: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {},
        relations = this.defaultRelations,
    ): Promise<T> {
        // Fetch the entity with its relations
        const entity = await this.primaryRepository.findOneOrFail({
            relations: relations,  // This should be the name of the relation in EntityA
        });

        // Duplicate the main entity
        const newEntity = this.primaryRepository.create(entity);
        delete newEntity.id;  // Ensure the ID is not copied
        const savedEntity = await this.primaryRepository.save(newEntity);

        // Duplicate the relations and associate them with the new entity
        for (const relationName of relations) {
            const relatedEntities = entity[relationName];
            if (Array.isArray(relatedEntities)) {  // Assuming it's a one-to-many relation if it's an array
                for (const relatedEntity of relatedEntities) {
                    delete relatedEntity.id;  // Ensure the ID is not copied
                    relatedEntity[relationName] = savedEntity;  // Associate with the new entity
                    // Assuming you have a map of repositories for each entity type
                    const relatedRepository = BaseCRUDController.getRepositoryForRelation(relationName);
                    await relatedRepository.save(relatedEntity);
                }
            } else {  // Handle one-to-one relation
                delete relatedEntities.id;
                relatedEntities[relationName] = savedEntity;
                const relatedRepository = BaseCRUDController.getRepositoryForRelation(relationName);
                await relatedRepository.save(relatedEntities);
            }
        }

        return savedEntity;
    }

}

