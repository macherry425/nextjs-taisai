import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE, DB_NAME } from "@/config/constants";
import clientPromise from "@/app/lib/mongodb";


export const POST = withApiHandler(async (request) => {
    const body = await request.json();
    const { tel, amount, dealer_tel } = body;
    console.log(body)
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
    const update = { $inc: { bank: amount } };
    // Check if a matching document exists
    const existingDoc = await collection.findOne(filter);
    if (!existingDoc) {
        return Response.json(
            error("No matching user found for the given filter.", BUSINESS_STATUS_CODE.ERROR),
            { status: 400 },
        );
    }


    const result = await collection.updateOne(filter, update);
    console.log(tel);
    var msg = "";
    if (result.modifiedCount > 0) {
        msg = `Bank updated successfully for tel: ${tel}`
    } else {
        msg = `Bank updated failed for tel: ${tel}`;
    }

    if (dealer_tel) {
        const filter = { tel: dealer_tel };
        const update = { $inc: { bank: amount * -1 } };

        const result = await collection.updateOne(filter, update);
        msg+= `| Updated Dealer: ${dealer_tel} : ${amount*-1}`
    }
    return Response.json(success({ msg: msg }), { status: 200 });

});
