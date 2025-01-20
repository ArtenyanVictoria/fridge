'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal"
import { IPurch } from "@/entities/Purch/Purch";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PagePurch() {
    const [items, setItems] = useState<IPurch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [modal, setModal] = useState(false);
    const [selectItem, setSelectItem] = useState<IPurch>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session }: any = useSession();

    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        fetch('/api/purch?name=' + session.user?.name, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setItems(data.items)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false)
            });
    }


    const handleDelete = (id: any) => {
        fetch("/api/purch/" + id, {
            method: "DELETE",
        })
            .then(() => {
                getItems()
            })
            .catch((error) => {
                console.error("Error fetching prizes:", error);
            });
    };

    async function addItmes(e: any) {
        try {
            e.preventDefault();
            const name = e.target[0].value;
            const amount = e.target[1].value;
            const res = await fetch('/api/purch/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, amount, username: session.user?.name}),
            })
            if (res.status === 200) {
                setModal(false);
                getItems()
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="max-w-[95vw] lg:max-w-[896px] xl:max-w-[1056px] w-full">
            <div className="flex w-full mt-10 justify-between">
                <Button onClick={() => setModal(true)}>
                    Добавить
                </Button>
                Количество продуктов:
            </div>

            {loading ?
                <h1 className='text-xl'>Загрузка...</h1>
                :
                <div className="mt-10 flex flex-col fap-4 max-w-[800px]">
                    <span className="grid grid-cols-3  text-sm pb-10">
                        <span className="text-center">
                            Название
                        </span>
                        <span className="text-center">
                            Количество
                        </span>
                        <span className="text-center">
                            Действия
                        </span>
                    </span>
                    {items.map((item, index) =>
                        <span className="grid grid-cols-3 pb-4 border-b border-b-[#f9fcff]/[.40]" key={index}>
                            <span className="flex items-center text-center justify-center gap-5">
                                {item.name}
                            </span>
                            <span className="text-center flex items-center justify-center">
                                {item.amount}
                            </span>
                            <span className="flex justify-center items-center gap-3">
                                <Trash2 className='cursor-pointer' onClick={() => handleDelete(item.id)} />
                            </span>
                        </span>
                    )}
                </div>
            }

            <Modal visible={modal} setVisible={setModal}>
                <form onSubmit={addItmes} className="grid w-full items-center gap-6 my-3">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="namePurch">Название</Label>
                        <Input id='namePurch' type="text" required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="count">Количество</Label>
                        <Input id='count' type="text" required />
                    </div>
                    <Button>
                        Добавить
                    </Button>
                </form>
            </Modal>
        </main>
    )
}
