export default function Reviews() {
  const reviews = [
    { id: 1, name: "Green Line Express", rating: "4.9", class: "AC Business" },
    { id: 2, name: "Karakoram Express", rating: "4.5", class: "AC Standard" },
    { id: 3, name: "Tezgam", rating: "4.2", class: "AC Business" }
  ];
  return (
    <section className="py-20 container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-12 text-blue-900 border-l-8 border-yellow-400 pl-4">Train Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map(r => (
          <div key={r.id} className="p-8 bg-slate-50 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
            <span className="text-yellow-500 font-bold">★ {r.rating}</span>
            <h3 className="text-2xl font-bold mt-2">{r.name}</h3>
            <p className="text-gray-500 mb-6">{r.class}</p>
            <button className="text-blue-600 font-bold hover:translate-x-2 transition-transform">Read Review →</button>
          </div>
        ))}
      </div>
    </section>
  );
}