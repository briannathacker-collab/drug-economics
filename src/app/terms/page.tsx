export const metadata = {
  title: "Terms of Use — DrugTracker | Vytalis Research",
};

const LAST_UPDATED = "2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-slate">
      <h1>Terms of Use</h1>
      <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <h2>1. Purpose and Scope</h2>
      <p>
        DrugTracker is a pharmaceutical pricing research and transparency tool
        operated by Vytalis Research. It is designed for use by researchers,
        journalists, policymakers, healthcare professionals, and other informed
        users seeking to understand U.S. drug pricing economics. By accessing
        this platform, you agree to these Terms of Use.
      </p>

      <h2>2. Informational Use Only</h2>
      <p>
        All data, analysis, estimates, and content on this platform are provided
        for <strong>informational and research purposes only</strong>. Nothing on
        this platform constitutes financial advice, investment advice, medical
        advice, or legal advice. Pricing figures are estimates derived from
        publicly available sources and modeling methodologies described in our{" "}
        <a href="/about">platform methodology documentation</a>. Actual prices
        vary by payer, contract, geography, and year.
      </p>

      <h2>3. Data Accuracy Disclaimer</h2>
      <p>
        Vytalis Research makes reasonable efforts to ensure data accuracy but
        does not warrant that pricing data, COGS estimates, reimbursement
        figures, or profit calculations are complete, current, or error-free.
        Drug pricing data may lag real-world changes. Users are encouraged to
        verify figures against primary sources including CMS drug pricing files,
        manufacturer SEC filings, and IQVIA databases before making decisions
        based on this data.
      </p>

      <h2>4. Permitted Use</h2>
      <p>You may use this platform to:</p>
      <ul>
        <li>Conduct non-commercial research and policy analysis</li>
        <li>
          Cite data in academic, journalistic, or policy publications with
          attribution to Vytalis Research and DrugTracker
        </li>
        <li>
          Share findings derived from platform data, provided the source is
          credited
        </li>
      </ul>

      <h2>5. Prohibited Use</h2>
      <p>You may not:</p>
      <ul>
        <li>
          Scrape, bulk-download, or systematically copy platform data for resale
          or redistribution without written permission
        </li>
        <li>
          Use platform data to make investment, trading, or financial decisions
          without independent verification
        </li>
        <li>
          Represent Vytalis Research estimates as official government,
          manufacturer, or insurer data
        </li>
        <li>Use this platform for any unlawful purpose</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        Platform design, methodology, and original analysis are the property of
        Vytalis Research. Underlying drug pricing data is derived from public
        sources. Attribution is required when citing or reproducing platform
        content.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Vytalis Research shall not be
        liable for any direct, indirect, incidental, or consequential damages
        arising from use of or reliance on this platform or its data.
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the
        platform after changes are posted constitutes acceptance of the revised
        Terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms? Use our{" "}
        <a href="/contact">contact form</a>.
      </p>
    </main>
  );
}
