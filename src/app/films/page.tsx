'use client'

import { useState, useEffect } from 'react'
interface Film {
id: string
filmName: string
dateRelease: number
year: number
rating?: number
posterUrl?: string
}