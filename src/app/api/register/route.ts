import User from '@/entities/User/User';
import connect from '@/lib/db'
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs"

export const POST = async (req: Request) => {
    const { name, password } = await req.json()

    await connect();

    const existingUser = await User.findOne({ name });

    if (existingUser) {
        return new NextResponse('Пользователь уже зарегистрирован с таким имененм', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        name,
        password: hashedPassword
    })

    try {
        await newUser.save()
        return new NextResponse('Пользователь успешно зарегистрирован', { status: 201 })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err)
        return new NextResponse('Ошибка при регистрации пользователя', { status: 500 })
    }
}