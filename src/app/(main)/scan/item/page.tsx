'use client'
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function PageInfo() {
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
                <Button>
                    Сохранить
                </Button>
            </span>
        </div>
    )
}
