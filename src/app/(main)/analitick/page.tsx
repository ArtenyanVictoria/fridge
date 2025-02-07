/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useMemo } from 'react'

export default function PageMonitor() {
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('3days');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session }: any = useSession();

  useEffect(() => {
    getItem()
  }, [])

  const filterDays = useMemo(() => {
    return (days) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let cutoffDate = new Date(today);

      switch (selectedPeriod) {
        case '3days':
          cutoffDate.setDate(cutoffDate.getDate() - 2);
          break;
        case 'week':
          cutoffDate.setDate(cutoffDate.getDate() - 6);
          break;
        case 'month':
          cutoffDate.setDate(cutoffDate.getDate() - 30);
          break;
        case 'all':
          return days.sort((a, b) => new Date(b.date) - new Date(a.date));
        default:
          cutoffDate = null;
      }

      if (!cutoffDate) return days;

      return days
        .filter(day => {
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);
          return dayDate >= cutoffDate;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    };
  }, [selectedPeriod]);

  async function getItem() {
    fetch('/api/analitic?name=' + session.user?.name, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setItem(data.items)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false)
      });
  }

  return (
    <main className="max-w-[95vw] lg:max-w-[896px] xl:max-w-[1056px] w-full mb-12">
      {loading ?
        <h1 className='text-xl'>Загрузка...</h1>
        :
        <>
          <div className='flex justify-between'>
            <h1 className='text-3xl mb-8'>Аналитика</h1>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="mb-4 p-2 border rounded bg-white cursor-pointer"
            >
              <option value="3days">Последние 3 дня</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="all">Всё время</option>
            </select>
          </div>

          {item == 0 ?
            <h1 className='text-xl'>Еще нету, что анализировать</h1>
            :
            <>

              <ul>
                {item[0]?.days?.length > 0 ? (
                  filterDays(item[0].days).map((day, index) => (
                    <li key={index}>
                      <h3 className='font-bold p-4 rounded-lg bg-[#c5dcf8]/[.4] w-max mb-4'>Дата: {day.date}</h3>
                      <ul className='flex w-full gap-4'>
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
                  ))
                ) : (
                  <p>Нет данных для отображения</p>
                )}
              </ul>
            </>
          }
        </>
      }
    </main>
  )
}