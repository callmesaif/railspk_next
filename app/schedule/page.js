export default function SchedulePage() {
  const trains = [
    { no: "1UP", name: "Khyber Mail", route: "Karachi - Peshawar", dep: "22:15", arr: "06:00 (Day 3)" },
    { no: "5UP", name: "Green Line", route: "Karachi - Islamabad", dep: "22:00", arr: "20:00 (Next Day)" },
    { no: "15UP", name: "Karachi Express", route: "Karachi - Lahore", dep: "18:30", arr: "12:00 (Next Day)" },
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-20 text-center">Train <span className="text-rail-accent">Schedule</span></h1>
      <div className="bg-[#f2f0f4] dark:bg-[#1b1b1f] rounded-[3rem] overflow-hidden shadow-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-rail-accent text-white text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6">No.</th>
              <th className="px-8 py-6">Name</th>
              <th className="px-8 py-6">Route</th>
              <th className="px-8 py-6">Departure</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold divide-y divide-gray-200 dark:divide-white/5">
            {trains.map((train, i) => (
              <tr key={i} className="hover:bg-rail-accent/5 transition-all">
                <td className="px-8 py-6 text-rail-accent">{train.no}</td>
                <td className="px-8 py-6 uppercase italic">{train.name}</td>
                <td className="px-8 py-6 text-gray-500">{train.route}</td>
                <td className="px-8 py-6">{train.dep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}