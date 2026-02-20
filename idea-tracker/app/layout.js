import './globals.css'

export const metadata = {
  title: 'Idea Tracker - Build Your Startup',
  description: 'Track and discuss startup ideas with your team',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
