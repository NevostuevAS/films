import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET () {
    const count = await prisma.films.count()
    return NextResponse.json({ 
    message: `В базе ${count} фильмов`,
    count: count 
  })
}