/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function PageMonitor() {
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session }: any = useSession();

  useEffect(() => {
    getItem()
  }, [])

  async function getItem() {
    fetch('/api/analitic?name=' + session.user?.name, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setItem(data.items[0])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false)
      });
  }

  return (
    <main className="max-w-[95vw] lg:max-w-[896px] xl:max-w-[1056px] w-full">
      {loading ?
        <h1 className='text-xl'>Загрузка...</h1>
        :
        <>
          <h1 className='text-3xl mb-8'>Аналитика</h1>
          <ul>
            {item.days.map((day, index) => (
              <li key={index}>
                <h3 className='font-bold p-4 rounded-lg bg-[#c5dcf8]/[.4] w-max mb-4'>Дата:    {day.date}</h3>
                <ul className='flex w-full'>
                  <div className='flex-1'>
                    <h4 className='font-bold'>Добавлено:</h4>
                    {day.events.filter(event => event.type === 'add').map((event, index) => (
                      <div className='my-3 max-w-96' key={index}>
                        <hr />
                        <li key={index} className='mt-3'>
                          <h4>Название: {event.nameItem}</h4>
                          <h4>Количество: {event.count}</h4>
                        </li>
                      </div>
                    ))}
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-bold'>Удалено:</h4>
                    {day.events.filter(event => event.type === 'delete').map((event, index) => (
                      <div className='my-3 max-w-96' key={index}>
                        <hr />
                        <li key={index} className='mt-3'>
                          <h4>Название: {event.nameItem}</h4>
                          <h4>Количество: {event.count}</h4>
                        </li>
                      </div>
                    ))}
                  </div>
                </ul>
              </li>
            ))}
          </ul>
        </>
      }
    </main>
  )
}
