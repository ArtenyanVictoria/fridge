import connect from '@/lib/db'
import Item from '@/entities/Item/Item';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const { name, type, manufactureDate, expirationDate, amount, nutrition, measureType, allergens } = await req.json();

    await connect();
    const newItem = new Item({ name, type, manufactureDate, expirationDate, amount, nutrition, measureType, allergens })

    try {
        await newItem.save();
        return new NextResponse('Продукт добавлен', { status: 200 })
    } catch (err) {
        console.log(err)
        return new NextResponse('Ошибка добавления продукта', { status: 500 })
    }
}