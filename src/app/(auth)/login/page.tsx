'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PageReg() {
    const [error, setError] = useState('')
    const router = useRouter();
    const { status: sessionStatus } = useSession()

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            router.replace('/')
        }
    }, [sessionStatus, router])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const name = e.target[0].value;
        const password = e.target[1].value;

        const res = await signIn("credentials", {
            redirect: false,
            name,
            password,
        });

        if (res?.error) {
            setError("Пароль не совпал")
            if (res?.url) router.replace('/admin')
        } else {
            setError('')
        }
    }

    return (
        <main className="w-full h-[100vh] flex items-center justify-center">
            {sessionStatus === "loading" ?
                <h1 className='text-xl'>Загрузка...</h1>
                :
                <Card className='max-w-[350px] w-full'>
                    <CardHeader>
                        <CardTitle>Войти</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Имя</Label>
                                <Input id='name' placeholder="Name" type="text" required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Пароль</Label>
                                <Input id='password' placeholder="Password" type="password" required />
                            </div>
                            <Button>
                                Войти
                            </Button>
                            <div className="text-center text-red-500">
                                {error}
                            </div>
                        </form>
                        <hr className="my-4" />
                        <Link className="w-full flex justify-center" href='/rigister'>Зарегистрироватся</Link>
                    </CardContent>
                </Card>
            }
        </main>
    )
}
