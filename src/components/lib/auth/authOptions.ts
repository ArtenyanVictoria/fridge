/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from '@/lib/db'
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import User from '@/entities/User/User'
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                name: { label: 'Name', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },

            async authorize(credentials: any) {
                await connect();
                try {
                    const user = await User.findOne({ name: credentials.name });
                    if (user) {
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                        if (isPasswordCorrect) {
                            return user;
                        }
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token }: any) {
            return token
        },
        async session({ session }: any) {
            return session
        }
    }
}