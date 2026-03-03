import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE, DB_NAME } from "@/config/constants";
import clientPromise from "@/app/lib/mongodb";

export const POST = withApiHandler(async (request) => {
    const body = await request.json();
    const { tel, amount } = body;
    const _amount = Number(amount);
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
    const update = { $inc: { bank: _amount, capital: _amount } };

    // Check if a matching document exists
    const existingDoc = await collection.findOne(filter);
    if (!existingDoc) {
        return Response.json(
            error("No matching user found for the given filter.", BUSINESS_STATUS_CODE.ERROR),
            { status: 400 },
        );
    }
    const result = await collection.updateOne(filter, update);
    console.log(result);
    var msg = "";
    if (result.modifiedCount > 0) {
        msg = `Capital updated successfully for tel: ${tel}`
    } else {
        msg = `Capital updated failed for tel: ${tel}`;
    }
    return Response.json(success({ msg: msg }), { status: 200 });
});
