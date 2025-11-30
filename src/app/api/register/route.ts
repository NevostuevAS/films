
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { login, password, name } = await request.json()
    
    console.log('📨 Получены данные:', { login, name })
    
    const user = await prisma.user.create({
      data: {
        login: login,
        name: name,
        password: password,
      },
    })

    console.log('✅ Пользователь создан:', user.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Регистрация успешна!' 
    })
    
  } catch (error: any) {
    console.error('❌ Ошибка регистрации:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Пользователь с таким логином уже существует' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Не удалось зарегистрировать пользователя: ' + error.message 
    }, { status: 400 })
  }
}