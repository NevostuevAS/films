import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

// GET - получить все фильмы
export async function GET() {
  try {
    const films = await prisma.films.findMany({
      orderBy: { year: 'desc' }
    })
    return NextResponse.json({ films })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки фильмов' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { filmName, dateRelease, year, rating, image, description } = await request.json() 
    
    const newFilm = await prisma.films.create({
      data: {
        filmName: filmName,         
        dateRelease,    
        year: parseInt(year),
        rating: parseInt(rating),
        image: image || null,
        description: description || "Нет описания"
      }
    })
    
    return NextResponse.json({ success: true, film: newFilm })
  } catch (error) {
    console.error('Error creating film:', error)
    return NextResponse.json({ error: 'Ошибка добавления фильма' }, { status: 500 })
  }
}