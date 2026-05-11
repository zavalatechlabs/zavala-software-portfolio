import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'About Maximiliano Zavala'
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
        background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
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
            fontSize: 72,
            fontWeight: 'bold',
            letterSpacing: '-0.05em',
            textAlign: 'center',
          }}
        >
          About Me
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          Full-Stack Developer passionate about building modern web applications
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
            marginTop: '20px',
          }}
        >
          zavalatechlabs.com/about
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
