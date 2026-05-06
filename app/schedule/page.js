export default function SchedulePage() {
  const trains = [
    { no: "27Up/28Dn", name: "Shalimar Express", route: "Karachi - Lahore", dep: "06:45", arr: "02:50" },
    { no: "11Up/12Dn", name: "Hazara Express", route: "Karachi - Havelian", dep: "06:35", arr: "16:40 (+1 Day)" },
    { no: "13Up/14Dn", name: "Awam Express", route: "Karachi - Peshawar", dep: "07:30", arr: "17:30 (+1 Day)" },
    { no: "151Up/152Dn", name: "Shah Latif Express", route: "Karachi - Mirpurkhas", dep: "07:00", arr: "11:25" },
    { no: "47up/48Dn", name: "Rehman Baba Express", route: "Karachi - Peshawar", dep: "12:00", arr: "18:10 (+1 Day)" },
    { no: "45Up/46Dn", name: "Pakistan Express", route: "Karachi - Rawalpindi", dep: "02:00", arr: "17:35 (+1 Day)" },
    { no: "41Up/42Dn", name: "Karakoram Express", route: "Karachi - Lahore", dep: "03:00", arr: "10:20 (+1 Day)" },
    { no: "9Up/10Dn", name: "Allama Iqbal Express", route: "Karachi - Sialkot", dep: "03:30", arr: "17:00 (+1 Day)" },
    { no: "33Up/34Dn", name: "Pak Business Express", route: "Karachi - Lahore", dep: "16:00", arr: "10:20 (+1 Day)" },
    { no: "17Up/18Dn", name: "Millat Express", route: "Karachi - Lalamusa", dep: "17:00", arr: "19:15 (+1 Day)" },
    { no: "7Up/8Dn", name: "Tezgam", route: "Karachi - Rawalpindi", dep: "17:30", arr: "20:00 (+1 Day)" },
    { no: "15Up/16Dn", name: "Karachi Express", route: "Karachi - Lahore", dep: "18:00", arr: "13:00 (+1 Day)" },
    { no: "25Up/26Dn", name: "Bahauddin Zakria Express", route: "Karachi - Multan", dep: "18:30", arr: "10:35 (+1 Day)" },
    { no: "37Up/38Dn", name: "Fareed Express", route: "Karachi - Lahore", dep: "19:30", arr: "22:05 (+1 Day)" },
    { no: "5Up/6Dn", name: "Greenline", route: "Karachi - Margala", dep: "22:00", arr: "22:10 (+1 Day)" },
    { no: "1Up/2Dn", name: "Khyber Mail", route: "Karachi - Peshawar", dep: "22:15", arr: "06:05 (+1 Day)" },
    { no: "145Up/146Dn", name: "Sukkur Express", route: "Karachi - Jacobabad", dep: "23:20", arr: "11:55 (+1 Day)" },
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
              <th className="px-8 py-6">Arrival</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold divide-y divide-gray-200 dark:divide-white/5">
            {trains.map((train, i) => (
              <tr key={i} className="hover:bg-rail-accent/5 transition-all">
                <td className="px-8 py-6 text-rail-accent">{train.no}</td>
                <td className="px-8 py-6 uppercase italic">{train.name}</td>
                <td className="px-8 py-6 text-gray-500">{train.route}</td>
                <td className="px-8 py-6">{train.dep}</td>
                <td className="px-8 py-6">{train.arr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}