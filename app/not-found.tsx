import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-block mb-8">
          <Image 
            src="https://i.imghippo.com/files/tyq3865Jxs.png" 
            alt="Nova" 
            width={150} 
            height={45}
            className="h-12 w-auto"
          />
        </Link>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg transition-all"
            style={{ backgroundColor: '#007AFF' }}
          >
            Go Home
          </Link>
          <Link 
            href="/login"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

