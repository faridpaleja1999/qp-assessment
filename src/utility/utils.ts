import bcrypt, { compare } from "bcrypt";
import { BCRYPT_HASH_ROUND } from "../constant/constant";

interface Pagination {
  offset: number;
  limit: number;
}

interface ApiResponse<T> {
  msg?: string;
  data: T | null;
  error: T | null;
  success: boolean;
}

type FormatResponse<T> = (
  success: boolean,
  msg: string,
  data: T | null
) => ApiResponse<T>;

//encrypt given string
export const hashingString = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, BCRYPT_HASH_ROUND);
};

export const comparePassword = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return compare(password, hashedPassword);
};

export const sendResponse: FormatResponse<unknown> = (
  success = true,
  msg,
  data = null
) => {
  return {
    message: msg,
    success,
    data: success && data ? { ...data } : null,
    error: success == false ? data : null,
  };
};

export const paginated = (page: Number, perPage: Number): Pagination => {
  const limit = Number(perPage) || 20;
  const offset = (Number(page) - 1) * limit;
  return {
    offset,
    limit,
  };
};

export const sortedBy = (
  sortBy = "createdAt",
  sortType = "DESC"
): [string, "ASC" | "DESC"] => {
  const sorttype: "ASC" | "DESC" = sortType == "ASC" ? "ASC" : "DESC";
  return [sortBy, sorttype];
};

export const calculateDiscountedPrice = (
  originalPrice: number,
  discountRate: number
): number => {
  return originalPrice - originalPrice * discountRate;
};

export const calculateTotalDiscountedPrice = (
  originalPrice: number,
  discountRate: number,
  quantity: number
): number => {
  const discountedPricePerUnit = calculateDiscountedPrice(
    originalPrice,
    discountRate
  );
  return discountedPricePerUnit * quantity;
};
