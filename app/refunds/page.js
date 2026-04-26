export default function RefundPage() {
  const refundRules = [
    { time: "48 Hours Before", deduction: "10%", detail: "Cancellation beyond 48 hours of departure." },
    { time: "24 - 48 Hours", deduction: "20%", detail: "Cancellation between 24 to 48 hours of departure." },
    { time: "After Departure", deduction: "0%", detail: "No refund is applicable once the train has left the station." }
  ];

  return (
    <main className="pt-32 pb-20 px-6 max-w-screen-xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter">
          Refund <span className="text-rail-accent">Policy</span>
        </h1>
        <p className="text-[#74777f] font-bold uppercase tracking-widest text-[10px] mt-4 italic">
          Official Cancellation & Deduction Guide
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        <div className="space-y-8">
            <h2 className="text-2xl font-black italic uppercase border-l-4 border-rail-accent pl-6">General Rules</h2>
            <div className="bg-[#f2f0f4] dark:bg-[#1b1b1f] p-10 rounded-[3rem] space-y-6">
                {[
                    "Tickets must be cancelled through the official e-ticketing portal (pakrail.gov.pk) or app.",
                    "Refund amount is credited back to the original payment method (JazzCash, EasyPaisa, or Bank).",
                    "For physical tickets, visit the nearest Reservation Office with original CNIC.",
                    "Service charges for online booking are non-refundable."
                ].map((text, i) => (
                    <div key={i} className="flex gap-4 items-start">
                        <span className="material-symbols-rounded text-rail-accent text-sm mt-1">check_circle</span>
                        <p className="text-sm font-medium italic text-[#44474e] dark:text-[#c4c6cf]">{text}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-8">
            <h2 className="text-2xl font-black italic uppercase border-l-4 border-rail-accent pl-6">Deduction Tiers</h2>
            <div className="space-y-4">
                {refundRules.map((rule, i) => (
                    <div key={i} className="bg-white dark:bg-[#2e2f33] p-8 rounded-[2rem] shadow-sm border border-transparent hover:border-rail-accent/20 transition-all flex justify-between items-center group">
                        <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-rail-accent transition-colors">{rule.time}</h4>
                            <p className="text-[10px] text-[#74777f] italic font-medium">{rule.detail}</p>
                        </div>
                        <div className="bg-rail-accent/10 text-rail-accent px-6 py-2 rounded-full font-black italic text-xl">
                            {rule.deduction}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-rail-accent text-white p-12 rounded-[4rem] text-center shadow-2xl shadow-rail-accent/20">
          <span className="material-symbols-rounded text-5xl mb-6">info</span>
          <h3 className="text-2xl font-black italic uppercase mb-4">Note for Passengers</h3>
          <p className="text-sm font-medium max-w-2xl mx-auto italic opacity-90 leading-relaxed">
            In case of train cancellation by Pakistan Railways or delays exceeding 6 hours, passengers are entitled to a **100% refund** with zero deductions. Please contact the Station Master or Helpline 117 for immediate assistance.
          </p>
      </div>
    </main>
  );
}