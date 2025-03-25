/// Just for populating temperary data for testing

import {getPrisma} from "@/lib/db";
import {users} from "@prisma/client";


async function addUsers() {
    const client = await getPrisma();
    client.users.create({
        data: {
            first_name: "test",
            last_name: "er",
            password: "1234"
        }
    });
    client.users.create({
        data: {
            first_name: "test2",
            last_name: "er2",
            password: "1234"
        }
    })
    console.log("created users");
}

addUsers();