import {DefaultSession, DefaultUser} from "next-auth";
import {AuthUser, Role} from "@/interfaces/user";

// Extend Session and Token types
declare module "next-auth" {
    interface User extends DefaultUser {
        id: number;
        name: string;
        email: string;
        role: Role;
        cookies?: string;
    }

    interface Session {
        user: AuthUser & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        name: string;
        email: string;
        role: Role;
        cookies?: string;
    }
}