'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function PageReg() {
    const [error, setError] = useState('')
    const router = useRouter();
    const { status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            router.replace('/')
        }
    }, [sessionStatus, router])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = (e.currentTarget[0] as HTMLFormElement).value;
        const password = (e.currentTarget[1] as HTMLFormElement).value;

        if (!password || password.length < 8) {
            setError('Пароль должен быть не менее 8 символов')
            return
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            })
            if (res.status === 400) {
                setError('Пользователь уже зарегистрирован с таким имененм')
            }
            if (res.status === 200) {
                setError("");
                router.replace("/login");
            }
        } catch (error) {
            setError("Ошибка, повторите попытку позже");
            console.log(error);
        }
    }

    return (
        <main className="w-full h-[100vh] flex items-center justify-center">
            {sessionStatus === "loading" ?
                <h1 className='text-xl'>Загрузка...</h1>
                :
                <Card className='max-w-[350px] w-full'>
                    <CardHeader>
                        <CardTitle>Зарегистрироватся</CardTitle>
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
                                Зарегистрироваться
                            </Button>
                            <div className="text-center text-red-500">
                                {error}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            }
        </main>
    )
}