import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // 1. ПОЛУЧАЕМ ДАННЫЕ ИЗ ЗАПРОСА
    const { login, password } = await request.json()
    
    console.log('🔐 Попытка входа:', login)

    // 2. ИЩЕМ ПОЛЬЗОВАТЕЛЯ В БАЗЕ ДАННЫХ
    const user = await prisma.user.findUnique({
      where: {
        login: login,  // ищем пользователя по логину
      },
    })

    // 3. ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН
    if (!user) {
      console.log('❌ Пользователь не найден')
      return NextResponse.json({ 
        success: false,
        error: 'Пользователь не найден' 
      }, { status: 401 })
    }

    // 4. ПРОВЕРЯЕМ ПАРОЛЬ
    if (user.password !== password) {
      console.log('❌ Неверный пароль')
      return NextResponse.json({ 
        success: false,
        error: 'Неверный пароль' 
      }, { status: 401 })
    }

    // 5. ЕСЛИ ВСЁ ПРАВИЛЬНО - УСПЕШНЫЙ ВХОД
    console.log('✅ Успешный вход:', user.name)
    
    return NextResponse.json({ 
      success: true,
      message: 'Вход выполнен!',
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        createdAt: user.createdAt
        // НЕ возвращаем пароль!
      }
    })
    
  } catch (error) {
    // 6. ЕСЛИ ПРОИЗОШЛА ОШИБКА
    console.error('❌ Ошибка сервера:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Ошибка сервера' 
    }, { status: 500 })
  }
}