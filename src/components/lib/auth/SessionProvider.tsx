'use client'

import { SessionProvider } from "next-auth/react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AuthProvider({ children }: any) {
    return <SessionProvider>{children}</SessionProvider>
}