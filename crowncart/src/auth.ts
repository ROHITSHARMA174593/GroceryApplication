import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import dbConnect from "@/lib/db"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
    }),
    Credentials({
        credentials: {
            email: {label: "email", type:"email"},
            password: {label: "Password", type: "password"}
        },
        async authorize(credentials){
                await dbConnect();
                const email = credentials?.email;
                const password = credentials?.password as string;
                const user = await User.findOne({email});
                if(!user){
                    throw new Error("No user found");
                }
                const isMatch = await bcrypt.compare(password, user.password); 
                if(!isMatch){
                    throw new Error("Incorrect Password");
                }
                return {
                    id:user._id.toString(),
                    name:user.name,
                    email:user.email,
                    role:user.role
                };
        }
    })

  ],
  callbacks:{
    async signIn({ user, account, profile }: any) {
        if (account?.provider === "google") {
            console.log("GOOGLE SIGNIN STARTED", user.email);
            await dbConnect();
            try {
                const existingUser = await User.findOne({ email: user.email });
                console.log("EXISTING USER?", existingUser);
                
                if (!existingUser) {
                    console.log("CREATING NEW USER...");
                     const newUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: "user",
                    });
                    console.log("NEW USER CREATED:", newUser);
                }
                return true;
            } catch (error) {
                console.error("Error creating user from Google login:", error);
                return false;
            }
        }
        return true; 
    },
    // token ke ander user ka data daalta hai
    async jwt({token, user, trigger, session}: any){
        if(user){
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.role = user.role;
        }
        if(!token.id || (token.id as string).length !== 24){
             await dbConnect();
             const dbUser = await User.findOne({email:token.email});
             if(dbUser){
                token.id = dbUser._id.toString();
                token.role = dbUser.role;
             }
        }
        if(trigger === "update"){
            token.role = session.role;
        }
        return token;
    },
    async session({session, token}: any){
        if(session.user){
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.role = token.role as string;
        }
        return session;
    }
  },
  pages:{
    signIn: "/login",
    error: "/login"
  },
  session:{
    strategy:"jwt",
    maxAge: 10 * 24 * 60 * 60 // 10 days
  },
  secret: process.env.AUTH_SECRET
})