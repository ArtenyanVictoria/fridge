import connect from '@/lib/db'
import Purch from '@/entities/Purch/Purch';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const { name, username, amount } = await req.json();

    await connect();
    const newItem = new Purch({ username, name, amount })

    try {
        await newItem.save();
        return new NextResponse('Продукт добавлен', { status: 200 })
    } catch (err) {
        console.log(err)
        return new NextResponse('Ошибка добавления продукта', { status: 500 })
    }
}