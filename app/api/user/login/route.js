import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { BUSINESS_STATUS_CODE, DB_NAME } from "@/config/constants";
import clientPromise from "@/app/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

const randomName = () => {
    const nameList = ["萬馬奔騰", "一馬當先", "駿業宏開", "馬上有成", "馬到功成", "策馬揚鞭", "龍馬精神", "馬年大吉", "福馬臨門", "闔家安康", "馬歲安康", "金馬迎春"];
    return nameList[Math.floor(Math.random() * nameList.length)];
};

export const POST = withApiHandler(async (request) => {
    const body = await request.json();

    const { tel, name, capital } = body;

    if (!tel) {
        return Response.json(
            error("Tel are required", BUSINESS_STATUS_CODE.ERROR),
            { status: 400 },
        );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("users");

    const filter = { tel: tel };
    // Check if user exists
    const existingUser = await collection.findOne(filter);
    // console.log(existingUser)
    // console.log(existingUser.data)
    if (!existingUser) {

        const _name = name.length > 0 ? name : randomName();
        // If it doesn't exist, insert the new document
        const result = await collection.insertOne({
            tel: tel,
            name: _name,
            capital: capital,
            bank: capital,
            id: uuidv4(),
        });
        console.log('Inserted new user:', result.insertedId);

        return Response.json(success({ id: result.insertedId }), { status: 200 });
    } else {
        console.log('user already exists');
        const _capital = Number(capital);
        var update = { $inc: { capital: _capital ? _capital : 0, bank: _capital ? _capital : 0 } };
        if (name) {
            update = { $set: { name: name }, $inc: { _capital: _capital ? _capital : 0, bank: _capital ? _capital : 0 } }
        }
        const result = await collection.updateOne(filter, update);
        return Response.json(success({ msg: "updated user info" }), { status: 200 });
    }
});
