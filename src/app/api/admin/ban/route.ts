import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { userId, banned } = await request.json()
    
    // Обновляем пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { banned: banned }
    })
    
    return NextResponse.json({
      success: true,
      message: banned 
        ? `Пользователь ${updatedUser.name} заблокирован`
        : `Пользователь ${updatedUser.name} разблокирован`,
      user: updatedUser
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Ошибка блокировки пользователя' 
    }, { status: 500 })
  }
}