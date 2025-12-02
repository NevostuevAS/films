import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json()
    
    console.log('🔐 Попытка входа:', login)

    const user = await prisma.user.findUnique({
      where: {
        login: login,  // ищем пользователя по логину
      },
    })

    if (!user) {
      console.log('❌ Пользователь не найден')
      return NextResponse.json({ 
        success: false,
        error: 'Пользователь не найден' 
      }, { status: 401 })
    }
    
    if (user.banned) {
      return NextResponse.json({ 
        error: 'Аккаунт заблокирован. Обратитесь к администратору.' 
      }, { status: 403 })
    }

    if (user.password !== password) {
      console.log('❌ Неверный пароль')
      return NextResponse.json({ 
        success: false,
        error: 'Неверный пароль' 
      }, { status: 401 })
    }

    console.log('✅ Успешный вход:', user.name)
    
    return NextResponse.json({ 
      success: true,
      message: 'Вход выполнен!',
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        createdAt: user.createdAt,
        admin: user.admin,
        banned: user.banned
      }
    })
    
  } catch (error) {
    console.error('❌ Ошибка сервера:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Ошибка сервера' 
    }, { status: 500 })
  }
}