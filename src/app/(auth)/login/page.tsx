'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


export default function PageReg() {
    const [error, setError] = useState('')
    return (
        <main className="w-full h-[100vh] flex items-center justify-center">
            <Card className='max-w-[350px] w-full'>
                <CardHeader>
                    <CardTitle>Войти</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="grid w-full items-center gap-4">
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
                </CardContent>
            </Card>
        </main>
    )
}
