import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import clientPromise from "@/app/lib/mongodb";
import { DB_NAME } from "@/config/constants";

export const GET = withApiHandler(async (request) => {
    const { searchParams } = new URL(request.url);
    const tel = searchParams.get("tel");
    if (!tel) {
        return Response.json(error("tel is required"), {
            status: 400,
        });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("users");
    const filter = { tel: tel };
    const user = await collection.findOne(filter);

    return Response.json(success(user), { status: 200 });
});
