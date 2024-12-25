import type { Metadata } from 'next'
import './globals.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { ThemeProvider } from '@/components/ui/theme/Theme-provider'
import { Toaster } from '@/components/ui/sonner'
import ConvexClientProvider from './providers/ConvexClientProvider'

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Real time chat-app'
}

export default function RootLayout({
  children:
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className="bg-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>

          <ConvexClientProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
