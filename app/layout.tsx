import './globals.css'
import { Josefin_Sans } from 'next/font/google'

const josefin_sans = Josefin_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Mr.Eco Landing Page',
  description: 'Mr.Eco Landing Page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${josefin_sans.className} text-[#0A0505]`}>{children}</body>
    </html>
  )
}
