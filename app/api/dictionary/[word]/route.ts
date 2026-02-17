import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) {
  const { word } = await params
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Word not found' }, { status: 404 })
  }

  const data = await res.json()
  const entry = data[0]

  const meanings = entry.meanings as Record<string, unknown>[] | undefined
  const firstMeaning = meanings?.[0]
  const definitions = firstMeaning?.definitions as Record<string, unknown>[] | undefined
  const firstDef = definitions?.[0]

  return NextResponse.json({
    word: entry.word,
    phonetic: entry.phonetic || (entry.phonetics as Record<string, string>[])?.[0]?.text || null,
    partOfSpeech: (firstMeaning?.partOfSpeech as string) || null,
    definition: (firstDef?.definition as string) || null,
    example: (firstDef?.example as string) || null,
    allMeanings: meanings?.map((m) => ({
      partOfSpeech: m.partOfSpeech,
      definitions: ((m.definitions as Record<string, unknown>[]) ?? []).slice(0, 3).map((d) => ({
        definition: d.definition,
        example: d.example || null,
      })),
    })),
  })
}
