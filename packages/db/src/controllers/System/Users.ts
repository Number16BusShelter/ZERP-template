import { BaseCRUDController } from "../abstract";
import { Addresses } from "../../entities/Chains/Addresses";
import { Users } from "../../entities/System/Users";
import { checkUUID, isNumeric } from "@zerp/utils";


export class UsersController extends BaseCRUDController<Users> {
    constructor() {
        super(Users, ["tgUser", "addresses", "profile", "profile.clan", "profile.boosts"]);
    }

    public async findUserAddressOrHandleOrIdOrTgId(addressOrTgIdOrHandle: string): Promise<Addresses | undefined> {
        let receiver: Users | null;
        const relations = ["tgUser", "activeSessionAddress", "addresses"];

        if (checkUUID(addressOrTgIdOrHandle)) {
            receiver = await this.find({
                id: addressOrTgIdOrHandle,
            }, relations);
        } else if (isNumeric(addressOrTgIdOrHandle)) {
            receiver = await this.find({
                tgUser: {
                    id: addressOrTgIdOrHandle,
                },
            }, relations);
        } else if (addressOrTgIdOrHandle.includes("@")) {
            receiver = await this.find({
                tgUser: {
                    username: addressOrTgIdOrHandle.replace("@", ""),
                },
            }, relations);
        } else {
            // TODO: check if address and create if does not exist
            receiver = await this.get([{
                activeSessionAddress: {
                    address: addressOrTgIdOrHandle,
                },
            }, {
                addresses: {
                    address: addressOrTgIdOrHandle,
                },
            }], relations);
        }

        const address = receiver?.activeSessionAddress && receiver?.addresses[0];
        // if (!address) {
        //     throw new UserAddressNotFound(addressOrTgIdOrHandle)
        // }

        return address;
    }
}

export default UsersController;
