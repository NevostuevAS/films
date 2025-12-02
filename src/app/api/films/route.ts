import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const url = new URL(request.url)
  
  // Если запрос: /api/films?count=true
  if (url.searchParams.get('count') === 'true') {
    const count = await prisma.films.count()
    return NextResponse.json({ 
      message: `В базе ${count} фильмов`,
      count: count 
    })
  }
  
  // Если запрос: /api/films (обычный)
  const films = await prisma.films.findMany({
    orderBy: { year: 'desc' }
  })
  return NextResponse.json({ films })
}

