import { User } from "../../src/types/UsersTypes";

declare global {
  namespace Express {
    interface Request {
      currentUser: User;
      query: {
        [key: string]: string | undefined;
      };
    }
  }
}