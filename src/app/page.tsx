'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password, name }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Регистрация успешна!');
        // Очищаем форму
        setLogin('');
        setPassword('');
        setName('');
        setIsSignUp(false);
      } else {
        alert(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      alert('Ошибка сети');
    }
  };


  if (isSignUp) {
    return (
      <div>
        <h1 className="header">Регистрация</h1>

        {/* форма регистрации */}
        <input className="inputauth" type = "text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин"/>
         <input className="inputauth" type = "text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль"/>
          <input className="inputauth" type = "text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя"/>
        <button className="back" onClick={handleRegister} >Зарегистрироваться</button>
        <button className="back" onClick={() => setIsSignUp(false)}>Назад</button>
      </div>
    );
  }

  return (
    <div className="header">
      <h1>Онлайн каталог фильмов</h1>
      <button className="auth" onClick={() => setIsSignUp(true)}>Регистрация</button>
    </div>
  );
}