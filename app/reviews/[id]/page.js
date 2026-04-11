import { trainsData } from '@/lib/trains';
import TrainDetailClient from './TrainDetailClient';

// 1. Build ke waqt sari train IDs generate karne ke liye
export async function generateStaticParams() {
  return trainsData.map((train) => ({
    id: train.id,
  }));
}

// 2. Server component jo client UI ko data bhejega
export default async function TrainDetailPage({ params }) {
    const { id } = await params; // Next.js 15+ mein params await hote hain
    const train = trainsData.find(t => t.id === id);

    if (!train) return <div className="min-h-screen flex items-center justify-center text-white font-black italic">DATA NOT FOUND</div>;

    return <TrainDetailClient train={train} />;
}