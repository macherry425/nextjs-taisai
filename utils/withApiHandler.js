import { NextRequest } from "next/server";
import { error } from "@/utils/apiResponse";
import { BUSINESS_STATUS_CODE } from "@/config/constants";

export function withApiHandler(
  handler,
  defaultStatus = BUSINESS_STATUS_CODE.ERROR,
) {
  return async (req) => {
    try {
      console.log("apiHandler")
      return await handler(req);
    } catch (err) {
      console.error("API Error:", err);
      return Response.json(
        error(err.message || "Internal Server Error", defaultStatus),
        { status: defaultStatus },
      );
    }
  };
}
