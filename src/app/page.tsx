'use client';

import { useState, useEffect } from 'react';

interface Film {
  id: string;
  filmName: string;
  dateRelease: string;
  year: number;
  rating: number;
  image?: string;
}

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuth, setisAuth] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [AuthUser, setAuthUser] = useState<{name: string; login: string} | null>(null);;
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const loadFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/films');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки фильмов');
      }
      
      const data = await response.json();
      setFilms(data.films);
      
    } catch (err) {
      setError('Не удалось загрузить фильмы');
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  loadFilms();
  }, []);
  
  ///////Сохранение пользователя
  useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    setAuthUser(JSON.parse(savedUser));
  }
}, []);
///////////////
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
        localStorage.setItem('user', JSON.stringify(result.user)); ///Сохраняем пользователя
        // Очищаем форму
        setLogin('');
        setPassword('');
        setisAuth(false);
        setAuthUser(result.user);
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
  if (AuthUser) {
    return (
      <div>
      <div className="header">
      <h1>Онлайн каталог фильмов</h1>
    <button className="auth" onClick={() => {
      setAuthUser(null)
    localStorage.removeItem('user');  
    }
      }>Выйти</button>
    <button className="auth">{AuthUser.name}</button>
    </div>
        {loading && <p>Загрузка фильмов...</p>}
        {error && <p>Ошибка: {error}</p>}
        {films.map(film => (
          <div className="films" key={film.id}>
            <img src={film.image} alt={film.filmName}></img>
            <h3>{film.filmName}</h3>
          </div>
        ))}
      </div>
  );
}
  return (
    <div>
    <div className="header">
      <h1>Онлайн каталог фильмов</h1>
      <button className="auth" onClick={() => setIsSignUp(true)}>Регистрация</button>
      <button className="auth" onClick={() => setisAuth(true)}>Авторизация</button>
      </div>
         {loading && <p>Загрузка фильмов...</p>}
        {error && <p>Ошибка: {error}</p>}
        {films.map(film => (
          <div className="films" key={film.id}>
            <img src={film.image} alt={film.filmName}></img>
            <h3>{film.filmName}</h3>
          </div>
        ))}
        </div>
  );
}