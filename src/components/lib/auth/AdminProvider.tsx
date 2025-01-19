'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminProvider({ children }: { children: React.ReactNode }) {
    const { status: sessionStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (sessionStatus === "unauthenticated") {
            router.replace("/login");
            // } else if (session === null || session === undefined) {
            //     router.replace("/")
        }
    }, [sessionStatus, router]);

    if (sessionStatus === "authenticated") {
        return <>{children}</>
    }

    return <main className="w-full h-[100vh] flex items-center justify-center  text-white text-xl">Загрузка...</main>
}
