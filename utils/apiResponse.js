import { BUSINESS_STATUS_CODE } from "@/config/constants";

export function success(
  data,
  message = "Success",
  status = BUSINESS_STATUS_CODE.SUCCESS,
) {
  return { status, message, data };
}

export function error(
  message = "Internal Server Error",
  status = BUSINESS_STATUS_CODE.ERROR,
  data= null,
) {
  return { status, message, data };
}
