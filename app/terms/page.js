export default function TermsPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 bg-white dark:bg-rail-dark text-gray-700 dark:text-gray-300">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-black uppercase italic mb-10 text-rail-accent">Terms of Service</h2>
        <div className="space-y-6 leading-relaxed text-gray-600 dark:text-gray-400">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>Welcome to The RAILSPK Hub. By using this platform, you agree to our terms and conditions. This website is dedicated to providing educational and documentary content regarding Pakistan Railways.</p>
          
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">Intellectual Property</h3>
          <p>All cinematic vlogs, high-resolution photographs, and digital data sets are the exclusive property of The RAILSPK. You may not reproduce, redistribute, or exploit this content for commercial purposes without explicit written authorization.</p>
          
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">User Contributions</h3>
          <p>When you post reviews or participate in community polls, you grant us a non-exclusive license to display that content. You must ensure that your contributions are respectful and do not violate third-party rights or ethical standards.</p>
          
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">Disclaimer</h3>
          <p>While we strive for accuracy, The RAILSPK is not liable for any discrepancies in fare data or schedule information. Information can change without notice; always confirm with official Pakistan Railways counters before travel.</p>
        </div>
      </div>
    </section>
  );
}