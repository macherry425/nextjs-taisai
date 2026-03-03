import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler";
import { error, success } from "@/utils/apiResponse";
import clientPromise from "@/app/lib/mongodb";
import { DB_NAME } from "@/config/constants";

export const GET = withApiHandler(async (request) => {


    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("users");

    const users = await collection.aggregate([
        {
            $set: {
                "difference": { $subtract: ["$bank", "$capital"] }
            }
        },
        {
            $sort: {
                "difference": -1
            }
        },
        {
            $unset: "difference"
        }
    ]).toArray();

    return Response.json(
        success({
            users
        }),
        { status: 200 },
    );
});
