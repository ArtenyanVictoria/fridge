import connect from '@/lib/db'
import Item from '@/entities/Item/Item';

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    try {
        await connect()
        const items = await Item.find({ username: name })

        return Response.json({ items })
    } catch (err) {
        console.log(err)
        return new Response('Ошибка сервера', { status: 500 })
    }
}