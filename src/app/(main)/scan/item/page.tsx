'use client'
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function PageInfo() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session }: any = useSession();
    const params = useSearchParams()
    const [param, setParams] = useState({});
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of params) {
            console.log(JSON.parse(value));
            setParams(JSON.parse(value))
        }
    }, [params])

    async function addItem() {
        try {
            const item = param
            item.username = session.user?.name
            const res = await fetch('/api/item/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            })
            if (res.status === 200) {
                router.push('/')
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='flex flex-col items-center gap-6'>
            <h2 className='text-3xl'>Параметры:</h2>
            <ul>
                {Object.keys(param).map((key) => (
                    <li key={key}>
                        <strong>{key}:</strong> {param[key]}
                    </li>
                ))}
            </ul>
            <span className='w-full gap-6 flex'>
                <Button onClick={() => router.push('/')} variant={'ghost'}>
                    Отмена
                </Button>
                <Button onClick={addItem}>
                    Сохранить
                </Button>
            </span>
        </div>
    )
}
