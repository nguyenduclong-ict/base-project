import { sendError } from "@/helpers";
import { User } from "../db";

declare global {
    namespace Express {
        interface Request {
            user?: User
            token?: string
            tokenData?: any
            sendError?: typeof sendError
        }
    }
}
