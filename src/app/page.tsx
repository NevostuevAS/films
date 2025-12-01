'use client';

import { useState, useEffect } from 'react';

interface Film {
  id: string;
  filmName: string;
  dateRelease: string;
  year: number;
  rating: number;
  image?: string;
  description: string;
}

interface User {
  id: string;
  login: string;
  name: string;
  createdAt: string;
  admin: boolean;
}

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuth, setisAuth] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [AuthUser, setAuthUser] = useState<{
  id: string;
  name: string; 
  login: string;
  createdAt: string;
  admin: boolean;
  } | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lk, setlk] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [filmsCount, setFilmsCount] = useState<number>(0);
  const [loadingFilmsCount, setLoadingFilmsCount] = useState(false)

 const loadFilmsCount = async () => {
  try {
    setLoadingFilmsCount(true);
    const response = await fetch('/api/films/count');
    
    if (response.ok) {
      const data = await response.json();
      setFilmsCount(data.count);
    }
  } catch (error) {
    console.error('Ошибка загрузки количества фильмов:', error);
  } finally {
    setLoadingFilmsCount(false);
  }
};

  const loadUserCount = async () => { ///////Счетчик зарег. пользователей
  try {
    setLoadingCount(true);
    const response = await fetch('/api/stats');
    
    if (response.ok) {
      const data = await response.json();
      setUserCount(data.count);
    }
  } catch (error) {
    console.error('Ошибка загрузки количества пользователей:', error);
  } finally {
    setLoadingCount(false);
  }
};

useEffect(() => {
  loadUserCount();
  loadFilmsCount(); 
}, []);


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
//////////Функция авторзиации
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
        localStorage.setItem('user', JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        login: result.user.login,
        admin: result.user.admin,
        createdAt: result.user.createdAt  // ← сохраняем дату
        })); ///Сохраняем пользователя
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
  ////////Функция регистрации  
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
  /////////Форма регистрации////
  if (isSignUp) {
    return (
      <div>
        <h1 className="header">Регистрация</h1>
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
 //////администратор панель
 if(lk && AuthUser?.admin) {
  return (
      <div>
      <div className="header">
      <h1>Панель управления</h1>
      <button className="back" onClick={() => setlk(false)}>Назад</button>
          </div>
          <div>
          <h1 className="stathead">Статистика сайта</h1>
          <h1>Всего фильмов в базе данных: {filmsCount}</h1>
          <h1>Зарегистрировано пользователей: {userCount}</h1>
      </div>
      </div>
  );
 }
 if(lk && AuthUser) {
  return (
      <div>
      <div className="header">
      <h1>Личный кабинет</h1>
      <button className="back" onClick={() => setlk(false)}>Назад</button>
          </div>
    <div className="lkinfo">
    <h1>Имя: {AuthUser.name}</h1>
    <h1>Дата регистрации: {
    new Date(AuthUser.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
    })
    }</h1>
    </div>
      </div>
  );
 }
 if (selectedFilm) {
  return (
    <div>
      <div className="header">
        <h1>Информация о фильме</h1>
        <button className="back" onClick={() => setSelectedFilm(null)}>
          Назад к списку
        </button>
      </div>
      <div className="film-detail-page">
        <img src={selectedFilm.image} alt={selectedFilm.filmName} />
        <h1>{selectedFilm.filmName}</h1>
        <h3>Дата выхода: {selectedFilm.year} год</h3>
        <h3>Рейтинг: {selectedFilm.rating}/10</h3>
        <p className="description">{selectedFilm.description}</p>
      </div>
    </div>
  );
}
 if (AuthUser?.admin) { ////////Пользователь авторизован как администратор
  return (
    <div>
      <div className="header">
      <h1>Фильмы онлайн</h1>
    <button className="auth" onClick={() => {
      setAuthUser(null)
    localStorage.removeItem('user');  
    }
      }>Выйти</button>
    <button className="auth" onClick={() => setlk(true)}>{AuthUser.name} - Вы администратор</button>
    </div>
        {loading && <p>Загрузка фильмов...</p>}
        {error && <p>Ошибка: {error}</p>}
        {films.map(film => (
          <div className="films" key={film.id} onClick={() => setSelectedFilm(film)} style={{ cursor: 'pointer' }}>
            <img src={film.image} alt={film.filmName}></img>
            <div className="filmName">
              <h3>{film.filmName}</h3>
              <h3>Дата выхода: {film.year} год</h3>
              </div>
          </div>
        ))}
        </div>
  );
 }
 if (AuthUser) {
    return (
      <div>
      <div className="header">
      <h1>Фильмы онлайн</h1>
    <button className="auth" onClick={() => {
      setAuthUser(null)
    localStorage.removeItem('user');  
    }
      }>Выйти</button>
    <button className="auth" onClick={() => setlk(true)}>{AuthUser.name}</button>
    </div>
        {loading && <p>Загрузка фильмов...</p>}
        {error && <p>Ошибка: {error}</p>}
        {films.map(film => (
          <div className="films" key={film.id} onClick={() => setSelectedFilm(film)} style={{ cursor: 'pointer' }}>
            <img src={film.image} alt={film.filmName}></img>
            <div className="filmName">
              <h3>{film.filmName}</h3>
              <h3>Дата выхода: {film.year} год</h3>
              </div>
          </div>
        ))}
        </div>
  );
}
///////////////////////////////
/////////Страница не авторизованного пользователя  
return (
    <div>
    <div className="header">
      <h1>Фильмы онлайн</h1>
     <div className="userstats">
     </div>
      <button className="auth" onClick={() => setIsSignUp(true)}>Регистрация</button>
      <button className="auth" onClick={() => setisAuth(true)}>Авторизация</button>
      </div>
         {loading && <p>Загрузка фильмов...</p>}
        {error && <p>Ошибка: {error}</p>}
        {films.map(film => (
          <div className="films" key={film.id} onClick={() => setSelectedFilm(film)} style={{ cursor: 'pointer' }}>
            <img src={film.image} alt={film.filmName}></img>
            <div className="filmName">
              <h3>{film.filmName}</h3>
              <h3>Дата выхода: {film.year} год</h3>
              </div>
          </div>
        ))}
        </div>
  );
}


//////////////