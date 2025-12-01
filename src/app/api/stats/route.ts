import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      count: userCount 
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Ошибка получения количества пользователей' 
    }, { status: 500 });
  }
}