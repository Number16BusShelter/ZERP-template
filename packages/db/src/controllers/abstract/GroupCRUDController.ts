import {FindOptionsWhere, In, Repository} from "typeorm";
import AppDataSource from "../../data-source";
import {BaseCRUDController, FindOptionsOrID} from "./BaseCRUDController";

/**
 * GroupCRUDController
 *
 * Abstract base class for controllers that handle CRUD operations involving groups and their members.
 *
 * @template T The entity type associated with the group.
 * @template MemberT The entity type associated with the member of the group.
 */
export abstract class GroupCRUDController<T, MemberT> extends BaseCRUDController<T> {
    /**
     * The repository associated with the group entity.
     */
    protected groupRepository: Repository<any>;

    /**
     * The constructor of the group entity.
     */
    protected groupEntity: new () => T;

    /**
     * The repository associated with the member entity.
     */
    protected memberRepository: Repository<any>;

    /**
     * The constructor of the member entity.
     */
    protected memberEntity: new () => MemberT;

    /**
     * The name of the many-to-many relation between the group and its members.
     */
    protected m2mRelationName: string;

    /**
     * Creates an instance of GroupCRUDController.
     * @param groupEntity The constructor of the group entity associated with the controller.
     * @param memberEntity The constructor of the member entity associated with the controller.
     * @param m2mRelationName The name of the many-to-many relation between the group and its members.
     * @param defaultRelations An optional array of default relations to include when querying the entities.
     */
    protected constructor(
        groupEntity: new () => T,
        memberEntity: new () => MemberT,
        m2mRelationName: string,
        defaultRelations?: string[]
    ) {
        super(groupEntity, defaultRelations); // Call the base constructor

        /**
         * The repository associated with the group entity.
         */
        this.groupRepository = AppDataSource.getRepository(groupEntity);

        /**
         * The constructor of the group entity.
         */
        this.groupEntity = groupEntity;

        /**
         * The repository associated with the member entity.
         */
        this.memberRepository = AppDataSource.getRepository(memberEntity);

        /**
         * The constructor of the member entity.
         */
        this.memberEntity = memberEntity;

        /**
         * The name of the many-to-many relation between the group and its members.
         */
        this.m2mRelationName = m2mRelationName;
    }

    /**
     * Add a single member to a group.
     *
     * **Warning:** Avoid running this function inside `.map()` due to performance concerns.
     *
     *  _Tip:_ It's better to use this function with `.forEach()` for optimal results.
     *
     * @param groupOptions - The ID of the group to which the member will be added.
     * @param memberOptions - The ID of the member to be added.
     */
    public async addMember(
        groupOptions: FindOptionsOrID<T>,
        memberOptions: FindOptionsOrID<MemberT>
    ): Promise<T> {
        const group = await this.groupRepository.findOneOrFail({
            where: this.normalizeFindOptions<T>(groupOptions),
            relations: this.defaultRelations
        });
        const member = await this.memberRepository.findOneOrFail({
            where: this.normalizeFindOptions<MemberT>(memberOptions)
        });

        group[this.m2mRelationName].push(member);
        return await this.groupRepository.save(group);
    }

    /**
     * Add multiple members to a group.
     *
     * @param groupId - The ID of the group.
     * @param memberIds - The IDs of the members to be added.
     */
    public async addMembers(
        groupId: any,
        memberIds: any[]
    ): Promise<void> {
        const group = await this.groupRepository.findOneOrFail({
            where: {
                id: groupId
            },
            relations: this.defaultRelations
        });
        const members = await this.memberRepository.findBy({id: In(memberIds)});

        group[this.m2mRelationName] = [...group.members, ...members];
        await this.groupRepository.save(group);
    }

    /**
     * Remove a member from a group.
     *
     * **Warning:** Avoid running this function inside `.map()` due to performance concerns.
     *
     *  _Tip:_ It's better to use this function with `.forEach()` for optimal results.
     *
     * @param groupOptions - The ID or search options of the group from which the member will be removed.
     * @param memberOptions - The ID or search options of the member to be removed.
     */
    public async removeMember(
        groupOptions: FindOptionsOrID<T>,
        memberOptions: FindOptionsOrID<MemberT>
    ): Promise<T> {
        const group = await this.groupRepository.findOneOrFail({
            where: this.normalizeFindOptions<T>(groupOptions),
            relations: this.defaultRelations
        });
        const member = await this.memberRepository.findOneOrFail({
            where: this.normalizeFindOptions<MemberT>(memberOptions)
        });

        group[this.m2mRelationName] = group[this.m2mRelationName].filter(m => m.id !== member.id);
        return this.groupRepository.save(group);
    }

    /**
     * Remove multiple members from a group.
     *
     * @param groupId - The ID of the group.
     * @param memberIds - The IDs of the members to be removed.
     */
    public async removeMembers(
        groupId: any,
        memberIds: any[]
    ): Promise<T> {
        const group = await this.groupRepository.findOneOrFail({
            where: {
                id: groupId
            },
            relations: this.defaultRelations
        });

        group[this.m2mRelationName] = group[this.m2mRelationName].filter(member => !memberIds.includes(member.id));
        return this[this.m2mRelationName].save(group);
    }

    /**
     * Duplicate a group along with its members.
     *
     * @param options - The ID of the group to be duplicated.
     */
    public override async duplicate(options: FindOptionsWhere<T> | FindOptionsWhere<T>[] | string | number): Promise<T> {
        // Fetch the group and its members.
        const group = await this.groupRepository.findOneOrFail({
            where: (typeof options == 'string' || typeof options == 'number') ? {id: options} : options,
            relations: this.defaultRelations
        });

        // Create a new group based on the fetched group, but without the ID.
        const duplicatedGroup: T = this.groupRepository.create({...group});
        delete (duplicatedGroup as any).id;  // Clear out the ID to ensure a new entity is created.

        // Save the new group. This ensures it has a new ID before we associate members with it.
        const savedDuplicatedGroup = await this.groupRepository.save(duplicatedGroup);

        // Associate the members of the original group with the new group.
        savedDuplicatedGroup[this.m2mRelationName] = group[this.m2mRelationName];

        // Save the new group again with its associated members.
        return this.groupRepository.save(savedDuplicatedGroup);
    }

}
