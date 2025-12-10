import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()


export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя обязателен' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { likedFilms: true }
    })
    
    return NextResponse.json({ 
      likedFilms: user?.likedFilms || [] 
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Ошибка загрузки избранного' 
    }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const { userId, filmId, action } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }
    
    let updatedLikedFilms
    
    if (action === 'add') {
      if (!user.likedFilms.includes(filmId)) {
        updatedLikedFilms = [...user.likedFilms, filmId]
      } else {
        updatedLikedFilms = user.likedFilms
      }
    } else {
      updatedLikedFilms = user.likedFilms.filter(id => id !== filmId)
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { likedFilms: updatedLikedFilms }
    })
    
    return NextResponse.json({
      success: true,
      message: action === 'add' ? 'Фильм добавлен в избранное' : 'Фильм удален из избранного',
      likedFilms: updatedUser.likedFilms
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Ошибка обновления избранного' 
    }, { status: 500 })
  }
}