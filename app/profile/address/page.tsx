"use client";

import React, { useState, useEffect } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const DeliveryAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState([
    "Ставрополь, ул. 50 лет ВЛКСМ, 113",
    "Ставрополь, ул. Тухачевского, 20",
    "Ставрополь, ул. Ленина, 235",
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([45.0355, 41.968]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<string>("");
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [ymapsLoaded, setYmapsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=0b05f0f2-29f9-4e78-a320-477441b055d9`;
    script.async = true;
    script.onload = () => {
      console.log("Яндекс.Карты успешно загружены");
      setYmapsLoaded(true);
    };
    script.onerror = (e) => {
      console.error("Ошибка при загрузке Яндекс.Карт:", e);
    };
    document.body.appendChild(script);
  }, []);

  const fetchAddressFromCoords = async (coords: [number, number]): Promise<string> => {
    if (!window.ymaps) {
      console.error("Yandex Maps API не загружен");
      return "Адрес не определен";
    }

    try {
      const myGeocoder = window.ymaps.geocode(coords);
      const res = await myGeocoder;
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        const addressText = firstGeoObject.properties.get("text");
        return typeof addressText === "string" ? addressText : "Не удалось определить адрес";
      }
      return "Не удалось определить адрес";
    } catch (error) {
      console.error("Ошибка при геокодировании:", error);
      return "Не удалось определить адрес";
    }
  };


  const addAddress = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress]);
      setNewAddress("");
      setIsAdding(false);
    }
  };

  const saveEditedAddress = () => {
    if (editingIndex !== null && editingAddress.trim()) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = editingAddress;
      setAddresses(updatedAddresses);
      setEditingIndex(null);
      setEditingAddress("");
    }
  };

  const handleMapClick = async (e: any, isEditing: boolean) => {
    const coords: [number, number] = e.get("coords"); // Получаем координаты клика
    if (!coords) return;

    const readableAddress = await fetchAddressFromCoords(coords);

    // Гарантируем, что в поле ввода всегда будет строка
    const addressToSet = readableAddress || "Не удалось определить адрес";

    if (isEditing) {
      setEditingAddress(addressToSet); // Обновляем адрес для редактирования
    } else {
      setNewAddress(addressToSet); // Обновляем новый адрес
    }
    setMapCenter(coords); // Обновление центра карты
  };

  const handleAddressInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNewAddress(inputValue);

    if (!inputValue.trim()) {
      setAddressSuggestions([]);
      return;
    }

    if (!ymapsLoaded) {
      console.error("Yandex Maps API не загружен");
      return;
    }

    try {
      const geocoder = await window.ymaps.geocode(inputValue, { results: 5 });
      const suggestions: string[] = [];

      geocoder.geoObjects.each((geoObj: any) => {
        suggestions.push(geoObj.properties.get("text"));
      });

      setAddressSuggestions(suggestions);
    } catch (error) {
      console.error("Ошибка при автозаполнении:", error);
      setAddressSuggestions([]);
    }
  };

  const handleAddressSelect = async (address: string) => {
    setNewAddress(address);
    setAddressSuggestions([]);

    if (ymapsLoaded && window.ymaps) {
      try {
        const geocoder = await window.ymaps.geocode(address);
        const firstGeoObject = geocoder.geoObjects.get(0);
        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates();
          setMapCenter(coords); // Обновляем центр карты
        }
      } catch (error) {
        console.error("Ошибка при геокодировании выбранного адреса:", error);
      }
    }
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6">
      <button
            className="text-[#FF0000] mr-4"
            onClick={() => window.location.href = "/profile"}
          >
            ← Личный кабинет
          </button>
      <h1 className="text-xl font-bold mb-6">Адрес доставки</h1>
      {addresses.length === 0 ? (
        <p className="text-center text-gray-500">Пусто</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editingAddress}
                    onChange={(e) => setEditingAddress(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-[#70B9BE] mb-2"
                  />
                  <div className="h-[300px] w-full mb-2">
                    <YMaps>
                      <Map
                        defaultState={{
                          center: mapCenter,
                          zoom: 12,
                        }}
                        className="w-full h-full rounded-md"
                        onClick={(e) => handleMapClick(e, true)}
                      >
                        <Placemark geometry={mapCenter} />
                      </Map>
                    </YMaps>
                  </div>
                  <button
                    onClick={saveEditedAddress}
                    className="w-full bg-[#70B9BE] text-white p-2 rounded-md"
                  >
                    Сохранить
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-black text-sm">{address}</p>
                  <button
                    className="text-[#70B9BE] ml-4"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditingAddress(address);
                      setMapCenter([45.0355, 41.968]);
                    }}
                  >
                    ✎
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        className="text-[#70B9BE] mt-6"
        onClick={() => setIsAdding(true)}
      >
        + Добавить адрес
      </button>
      {isAdding && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            value={newAddress}
            onChange={handleAddressInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-[#70B9BE] mb-2"
            placeholder="Введите адрес"
          />
          {addressSuggestions.length > 0 && (
            <ul className="bg-white border mt-2 rounded-md shadow-md max-h-60 overflow-auto">
              {addressSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-[#70B9BE] hover:text-white"
                  onClick={() => handleAddressSelect(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <div className="h-[300px] w-full mb-2">
            <YMaps>
              <Map
                defaultState={{
                  center: mapCenter,
                  zoom: 12,
                }}
                className="w-full h-full rounded-md"
                onClick={(e) => handleMapClick(e, false)}
              >
                <Placemark geometry={mapCenter} />
              </Map>
            </YMaps>
          </div>
          <button
            onClick={addAddress}
            className="w-full bg-[#70B9BE] text-white p-2 rounded-md"
          >
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressesPage;
