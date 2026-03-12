import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center p-10">
      
      <h1 className="text-5xl font-bold mb-6 text-center">
        AINSEP
      </h1>

      <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl">
        AI-Based Stock Price Trend Prediction System powered by 
        Machine Learning and real-time streaming.
      </p>

      <Link
        href="/prediction"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold transition"
      >
        View Live Prediction
      </Link>

    </div>
  );
}