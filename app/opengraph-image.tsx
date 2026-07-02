import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Maximiliano Zavala - Portfolio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            letterSpacing: '-0.05em',
            textAlign: 'center',
          }}
        >
          Maximiliano Zavala
        </div>
        <div
          style={{
            fontSize: 40,
            opacity: 0.9,
            textAlign: 'center',
          }}
        >
          Full-Stack Developer & Software Engineer
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
            display: 'flex',
            gap: '20px',
          }}
        >
          <span>Next.js</span>
          <span>•</span>
          <span>TypeScript</span>
          <span>•</span>
          <span>React</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
