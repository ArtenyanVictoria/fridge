/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Modal from "@/components/ui/Modal";
import { IItem } from "@/entities/Item/Item";
import { Eye, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modal, setModal] = useState(false);
  const [selectItem, setSelectItem] = useState<IItem>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session }: any = useSession();

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    if (loading == false) {
      items.map(item => {
        if ((new Date() - new Date(item.expirationDate)) / (1000 * 3600 * 24) >= 1) {
          toast("В наличие есть один просроченый продукт")
        }
      })
    }
  }, [loading])

  async function getItems() {
    fetch('/api/item?name=' + session.user?.name, {
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


  const handleDelete = (item: IItem) => {
    fetch("/api/item/" + item.id, {
      method: "DELETE",
    })
      .then(() => {
        getItems()
        fetch("/api/analitic", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: session.user?.name,
            nameItem: item.name,
            count: item.amount,
            type: 'delete'
          }),
        })
          .catch((error) => {
            console.error("Error fetching prizes:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching prizes:", error);
      });
  };

  const filteredLogs = items.filter(item => {
    const logName = item.name.toLowerCase();
    const logType = item.type.toLowerCase();
    const logAlerg = item.allergens.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();

    return logName.includes(searchQueryLower) || logType.includes(searchQueryLower) || logAlerg.includes(searchQueryLower);
  });

  return (
    <main className="max-w-[95vw] lg:max-w-[896px] xl:max-w-[1056px] w-full">
      {loading ?
        <h1 className='text-xl'>Загрузка...</h1>
        :
        <div className="mt-10 flex flex-col fap-4">
          <span className="relative max-w-[600px] mb-12">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type='text'
              className={
                "flex h-14 w-full rounded-lg border border-input focus-visible:outline-0 bg-background px-6 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              }
              placeholder="Поиск"
            />
            <svg className="absolute top-0 bottom-0 m-auto right-[10px] pointer-events-none" width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width={38} height={38} rx={6} fill="#EDEFF0" />
              <path fillRule="evenodd" clipRule="evenodd" d="M16.8361 11.0363C15.8776 11.173 14.9937 11.4826 14.2241 11.9512C12.9995 12.6969 12.0156 13.8398 11.4995 15.116C11.1535 15.9716 11.0302 16.5626 11.0035 17.4946C10.9699 18.6633 11.1787 19.6348 11.6776 20.6317C12.0513 21.3784 12.4654 21.9368 13.0847 22.529C13.5797 23.0024 14.0555 23.3352 14.6944 23.6551C15.7686 24.1928 16.7614 24.406 17.9633 24.3569C19.3645 24.2996 20.6504 23.8271 21.7905 22.9506L22.0105 22.7815L24.1203 24.8907L26.23 27L26.615 26.615L27 26.23L24.8905 24.1205L22.781 22.011L22.9502 21.791C23.8249 20.6531 24.2995 19.3618 24.3566 17.9642C24.4057 16.7638 24.1936 15.7752 23.6555 14.6956C23.3015 13.9854 22.9876 13.5554 22.3795 12.9476C21.3169 11.8856 20.0953 11.2708 18.6161 11.0536C18.1863 10.9905 17.2228 10.9811 16.8361 11.0363ZM16.9738 12.1287C16.5517 12.1816 15.8974 12.3597 15.5117 12.5267C14.7719 12.8469 14.2872 13.1798 13.697 13.7731C12.9229 14.5512 12.4318 15.4708 12.1911 16.5929C12.079 17.1158 12.0694 18.1597 12.1721 18.6781C12.6088 20.8828 14.223 22.5906 16.3589 23.1078C17.2485 23.3231 18.1648 23.3184 19.0538 23.0939C21.0481 22.5903 22.626 20.9925 23.1124 18.9842C23.6839 16.6239 22.6406 14.142 20.5489 12.8863C19.4844 12.2473 18.1996 11.9751 16.9738 12.1287Z" fill="#363636" />
            </svg>
          </span>
          <span className="grid grid-cols-5 text-sm pb-10">
            <span className="text-center">
              Название
            </span>
            <span className="text-center">
              Количество
            </span>
            <span className="text-center">
              {/* TODO: Показ приближение срока годности */}
              Срок годности
            </span>
            <span className="text-center">
              Аллергены
            </span>
            <span className="text-center">
              Действия
            </span>
          </span>
          {filteredLogs.map((item, index) =>
            <span className="grid grid-cols-5 pb-4 border-b border-b-[#f9fcff]/[.40]" key={index}>
              <span className="flex items-center text-center justify-center gap-5">
                {item.name}
              </span>
              <span className="text-center flex items-center justify-center">
                {item.amount}
              </span>
              <span
                className="flex justify-center items-center"
                style={{
                  color:
                    (new Date() - new Date(item.expirationDate)) / (1000 * 3600 * 24) >= 1 ? 'red' : Math.abs((new Date() - new Date(item.expirationDate)) / (1000 * 3600 * 24)) <= 3 ? 'orange' : 'green'
                }}
              >
                {item.expirationDate}
              </span>
              <span className="flex justify-center items-center">
                {item.allergens == '' ? 'Нету' : item.allergens}
              </span>
              <span className="flex justify-center items-center gap-3">
                <Eye className="cursor-pointer" onClick={() => { setSelectItem(item); setModal(true) }} />
                <Trash2 className='cursor-pointer' onClick={() => handleDelete(item)} />
              </span>
            </span>
          )}
        </div>
      }
      <Modal visible={modal} setVisible={setModal}>
        <ul className="flex flex-col gap-2">
          <li className="flex justify-between"><strong>Название:</strong>{selectItem?.name}</li>
          <li className="flex justify-between"><strong>Тип:</strong>{selectItem?.type}</li>
          <li className="flex justify-between"><strong>Дата изготовление:</strong>{selectItem?.manufactureDate}</li>
          <li className="flex justify-between"><strong>Дата истечения:</strong>{selectItem?.expirationDate}</li>
          <li className="flex justify-between"><strong>Масса/количество:</strong>{selectItem?.amount}</li>
          <li className="flex justify-between"><strong>Пищевая ценность:</strong>{selectItem?.nutrition}</li>
          <li className="flex justify-between"><strong>Тип измерения:</strong>{selectItem?.measureType}</li>
          <li className="flex justify-between"><strong>Аллергены:</strong>{selectItem?.allergens == '' ? 'Нету' : selectItem?.allergens}</li>
        </ul>
      </Modal>
    </main >
  );
}
