'use client'
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'

export default function Header() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session }: any = useSession();
    return (
        <header className='max-w-[95vw] lg:max-w-[896px] xl:max-w-[1056px] my-6 flex w-full justify-between  items-center p-2 gap-12 rounded-lg border border-[#e5e6e8]/[.4] bg-[#c5dcf8]/[.4] z-40'>
            <nav className='flex items-center gap-3'>
                <Link href={'/'} className='hover:bg-[#c5dcf8]/[.6] transition-all duration-300 px-4 py-2 rounded-lg'>Главная</Link>
                <Link href={'/scan'} className='hover:bg-[#c5dcf8]/[.6] transition-all duration-300 px-4 py-2 rounded-lg'>Распознать</Link>
                <Link href={'/analitick'} className='hover:bg-[#c5dcf8]/[.6] transition-all duration-300 px-4 py-2 rounded-lg'>Аналитика</Link>
            </nav>
            <div className='flex gap-3 items-center'>
                <span>{session.user.name}</span>
                <Button onClick={() => { signOut() }}>
                    Выйти
                </Button>
            </div>
        </header>
    )
}
