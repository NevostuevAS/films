'use client';

import { useState } from 'react';

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuth, setisAuth] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [AuthUser, setAuthUser] = useState(false);

  const handleAuth = async () => {
   try{
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password}),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Авторизация успешна!');
        // Очищаем форму
        setLogin('');
        setPassword('');
        setAuthUser(true);
      } else {
        alert(result.error || 'Ошибка авторизации');
      }
    } catch (error) {
      alert('Ошибка сети');
    }
  };
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
        setisAuth(true);
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
 if (isAuth) {
  return (
    /////Форма авторизации///
    <div>
        <h1 className="header">Авторизация</h1>

        <input className="inputauth" type = "text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин"/>
         <input className="inputauth" type = "text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль"/>
        <button className="back" onClick={handleAuth}>Войти</button>
        <button className="back" onClick={() => setisAuth(false)}>Назад</button>
      </div>
    );
 }
  return (
    <div className="header">
      <h1>Онлайн каталог фильмов</h1>
      <button className="auth" onClick={() => setIsSignUp(true)}>Регистрация</button>
      <button className="auth" onClick={() => setisAuth(true)}>Авторизация</button>
    </div>
  );
}