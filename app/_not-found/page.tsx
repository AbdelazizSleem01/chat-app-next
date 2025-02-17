// app/_not-found/page.tsx
export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>404 - Page Not Found</h1>
        <p>The page you’re looking for doesn’t exist.</p>
      </div>
    );
  }
  
  // Optional: Force static rendering
  export const dynamic = 'force-static';