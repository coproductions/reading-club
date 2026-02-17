import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json([])

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  const hasValidKey = apiKey && !apiKey.includes('placeholder')
  const url = hasValidKey
    ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&key=${apiKey}`
    : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`

  const res = await fetch(url)
  const data = await res.json()

  const books = (data.items || []).map((item: Record<string, unknown>) => {
    const info = item.volumeInfo as Record<string, unknown> | undefined
    const imageLinks = info?.imageLinks as Record<string, string> | undefined
    const authors = info?.authors as string[] | undefined
    return {
      googleBooksId: item.id,
      title: info?.title ?? 'Unknown Title',
      author: authors?.join(', ') ?? 'Unknown Author',
      coverUrl: imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
      publishedDate: info?.publishedDate ?? null,
    }
  })

  return NextResponse.json(books)
}
