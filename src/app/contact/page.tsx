import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact — DrugTracker | Vytalis Research",
  description:
    "Research inquiries, data questions, and partnership requests.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Contact</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          For research inquiries, data methodology questions, press, or
          partnership requests. This platform is operated by{" "}
          <a
            href="https://vytalisresearch.com"
            className="text-slate-900 underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vytalis Research
          </a>
          .
        </p>
      </div>

      <ContactForm />
    </main>
  );
}
