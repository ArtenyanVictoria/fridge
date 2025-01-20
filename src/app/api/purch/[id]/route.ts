import connect from '@/lib/db'
import Purch from '@/entities/Purch/Purch';

export const DELETE = async (req: Request, {params}: {params: {id: string}}) => {
    const id = params.id

    try {
        await connect();

        Purch.findOneAndDelete({id: id}).remove().exec()

        return new Response('Продукт удален', {status: 200})
        
    } catch (err) {
        console.log(err)
        return new Response("Ошибка сервера", { status: 500 })
    }
}