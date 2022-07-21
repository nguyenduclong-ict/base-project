import { sendError } from "@/helpers";
import { User } from "../database";

declare global {
    namespace Express {
        interface Request {
            user?: User
            shopId?: string
            shop?: Shop // xác định shop của mỗi request nếu có
            token?: string
            tokenData?: any
            sendError?: typeof sendError
        }
    }
}
