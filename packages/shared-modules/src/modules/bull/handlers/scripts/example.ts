import { UsersController } from "@zerp/db"

export async function exampleHandler() {
    const uc = new UsersController()
    return (await uc.list()).length
}
