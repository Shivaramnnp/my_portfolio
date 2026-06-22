import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = path.join('/')
  const targetUrl = `https://tgirqnsnqvjquenrndxq.supabase.co/storage/v1/object/public/portfolio/${filePath}`

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      // Avoid static caching of fetch responses in Next.js
      cache: 'no-store'
    })

    if (!res.ok) {
      return new NextResponse(`Failed to fetch resource: ${res.statusText}`, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await res.arrayBuffer()
    const contentLength = res.headers.get('content-length') || arrayBuffer.byteLength.toString()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error proxying Supabase resource:', error)
    return new NextResponse(`Error loading resource: ${error.message}`, { status: 500 })
  }
}
