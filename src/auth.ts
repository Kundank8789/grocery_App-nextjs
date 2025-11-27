import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectdb from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";
export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "email", type: "email"},
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request) {
        
                    await connectdb()
                    const email=credentials.email;
                    const password=credentials.password as string;
                    const user=await User.findOne({email})
                        if(!user){
                            throw new Error("No user found with this email");
                        }
                        const isMatch=await bcrypt.compare(password,user.password)
                        if(!isMatch){
                            throw new Error("Invalid password");
                        }
                        return{
                            id:user._id.toString(),
                            name:user.name,
                            email:user.email,
                            role:user.role
                        }
                    
            
                    
                }
        })
    
    ],
    callbacks: {
        jwt({token, user}){
            if(user){
                token.id=user.id;
                token.name=user.name;
                token.email=user.email;
                token.role=user.role;
            }
            return token;
        },
        session({session, token}){
            if(session.user){
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH0_SECRET  ,
});