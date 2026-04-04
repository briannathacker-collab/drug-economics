export const metadata = {
  title: "Privacy Policy — DrugTracker | Vytalis Research",
};

const LAST_UPDATED = "2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <h2>1. What We Collect</h2>
      <p>
        DrugTracker is a research tool. We collect minimal personal information:
      </p>
      <ul>
        <li>
          <strong>Contact form submissions</strong> — name, email address, and
          message content submitted via our contact form. This data is processed
          by Formspree and delivered to Vytalis Research. We do not store form
          submissions in our own database.
        </li>
        <li>
          <strong>Analytics</strong> — if analytics are enabled, we collect
          anonymized usage data (pages visited, session duration) via a
          privacy-respecting analytics provider. No personally identifiable
          information is collected via analytics.
        </li>
        <li>
          <strong>No accounts</strong> — this platform does not require user
          registration. We do not collect passwords, payment information, or
          account credentials.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        Contact form data is used solely to respond to your inquiry. We do not
        sell, rent, or share your personal information with third parties for
        marketing purposes.
      </p>

      <h2>3. Third-Party Services</h2>
      <p>This platform uses the following third-party services:</p>
      <ul>
        <li>
          <strong>Formspree</strong> — processes contact form submissions. See{" "}
          <a
            href="https://formspree.io/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Formspree&apos;s Privacy Policy
          </a>
          .
        </li>
        <li>
          <strong>Cloudflare</strong> — domain and infrastructure. See{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare&apos;s Privacy Policy
          </a>
          .
        </li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        We use only functional cookies necessary for platform operation. We do
        not use advertising cookies or tracking pixels. You can disable cookies
        in your browser without affecting core platform functionality.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        Contact form submissions are retained by Formspree per their data
        retention policy. We do not retain personal data beyond what is needed to
        respond to your inquiry.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request deletion of any personal data you have submitted to us
        via our <a href="/contact">contact form</a>. We will respond within 30
        days.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy as the platform evolves. Material changes will
        be noted on this page with an updated date.
      </p>

      <h2>8. Contact</h2>
      <p>
        Privacy questions? Use our <a href="/contact">contact form</a>.
      </p>
    </main>
  );
}
