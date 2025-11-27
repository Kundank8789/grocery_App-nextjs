declare module "next-auth" {
    interface Session {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}
export {};