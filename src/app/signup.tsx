'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    alert(`Вы ввели:
Логин: ${login}
Пароль: ${password} 
Имя: ${name || 'не указано'}`);
    
    setLogin('');
    setPassword('');
    setName('');
  };

  return (
    <div>
      {/* Заголовок */}
      <h1 className="header">Онлайн каталог фильмов</h1>
      
      {/* Форма регистрации */}
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <h2>Регистрация</h2>
        <div style={{ marginBottom: '15px' }}>
          <div>Имя:</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ваше имя"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div>Логин:</div>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Логин"
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div>Пароль:</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Пароль"
            required
          />
        </div>

        <button
          onClick={handleRegister}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
