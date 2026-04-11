export default function PrivacyPage() {
  return (
    <section className="min-h-screen pt-32 pb-20 bg-white dark:bg-rail-dark text-gray-700 dark:text-gray-300">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-black uppercase italic mb-10 text-rail-accent">Privacy Policy</h2>
        <div className="space-y-6 leading-relaxed text-gray-600 dark:text-gray-400">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>The RAILSPK Hub is committed to protecting your digital privacy. This policy explains our data practices for this platform.</p>
          
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">Data Protection</h3>
          <p>We do not collect personally identifiable information (PII) such as emails or phone numbers for general browsing. User participation in reviews and polls is tracked via anonymous Firebase identifiers to ensure system integrity.</p>
          
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">Technical Storage</h3>
          <p>We use browser Local Storage only to remember your preference for Dark Mode and to maintain secure, anonymous session tokens. We do not use persistent tracking cookies for advertising.</p>
          
          <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">Third-Party Services</h3>
          <p>This platform utilizes YouTube API Services to display vlogs and Firebase Firestore for community data management. By using this site, you agree to comply with their respective privacy terms.</p>
        </div>
      </div>
    </section>
  );
}