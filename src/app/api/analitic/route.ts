import connect from '@/lib/db'
import Analitic from '@/entities/Analitic/Analitic';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const { username, nameItem, count, type } = await req.json();

    await connect();
    const user = await Analitic.findOne({ username })

    try {
        if (user) {
            const day = user.days.find((day: { date: string; }) => day.date === new Date().toLocaleDateString('ru-RU').split('-').reverse().join('-'));
            if (day) {
                day.events.push({ nameItem, count, type });
            } else {
                user.days.push({ date: new Date().toLocaleDateString('ru-RU').split('-').reverse().join('-'), events: [{ nameItem, count, type }] });
            }
            await user.save();
        } else {
            const newUser = new Analitic({
                username,
                days: [{ date: new Date().toLocaleDateString('ru-RU').split('-').reverse().join('-'), events: [{ nameItem, count, type }] }]
            });
            await newUser.save();
        }
        return new NextResponse('Аналитика сохронена', { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse('Ошибка добавления продукта', { status: 500 })
    }
}

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    try {
        await connect()
        const items = await Analitic.find({ username: name })

        return Response.json({ items })
    } catch (err) {
        console.log(err)
        return new Response('Ошибка сервера', { status: 500 })
    }
}