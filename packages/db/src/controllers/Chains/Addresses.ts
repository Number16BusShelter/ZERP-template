import {BaseCRUDController} from "../abstract";
import {Addresses} from "@/entities";

export class AddressesController extends BaseCRUDController<Addresses> {
    constructor() {
        super(Addresses, ['user'])
    }
}

export default AddressesController
