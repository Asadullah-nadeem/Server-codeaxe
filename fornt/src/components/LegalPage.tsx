
import SectionHeader from "@/components/SectionHeader";

const legalContent: Record<string, { title: string; label: string; sections: { heading: string; text: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    label: "PRIVACY",
    sections: [
      { heading: "Data Collection", text: "We collect only the information necessary to provide our services — your name, email, company name, and project details submitted through our contact form. We do not use tracking cookies or third-party analytics that compromise your privacy." },
      { heading: "Data Usage", text: "Your information is used exclusively to communicate about your project inquiry, provide services you've requested, and send relevant project updates. We never sell, rent, or share your data with third parties for marketing purposes." },
      { heading: "Data Protection", text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access to personal data is restricted to authorized team members on a need-to-know basis." },
      { heading: "Your Rights", text: "You have the right to access, correct, or delete your personal data at any time. Contact us at hello@codeaxe.dev to exercise these rights. We respond to all data requests within 30 days." },
    ],
  },
  terms: {
    title: "Terms of Service",
    label: "TERMS",
    sections: [
      { heading: "Service Agreement", text: "By engaging CodeAxe for development services, you agree to the terms outlined in your project contract including scope, timeline, and payment schedule. All custom development work is governed by individual project agreements." },
      { heading: "Intellectual Property", text: "Upon full payment, all custom code, designs, and deliverables created for your project become your intellectual property. CodeAxe retains the right to use general techniques and methodologies developed during the engagement." },
      { heading: "Confidentiality", text: "We treat all client information, business logic, and proprietary data as strictly confidential. NDAs are available upon request and are standard for enterprise engagements." },
      { heading: "Liability", text: "CodeAxe's liability is limited to the total amount paid for services. We are not liable for indirect, incidental, or consequential damages arising from the use of delivered software." },
    ],
  },
  "refund-cancellation": {
    title: "Refund & Cancellation",
    label: "CANCELLATION",
    sections: [
      { heading: "Project Cancellation", text: "Either party may terminate a project with 14 days written notice. Upon cancellation, you will be billed for all completed work and any work-in-progress up to the cancellation date." },
      { heading: "Milestone-Based Billing", text: "Projects are billed at defined milestones. Cancellation between milestones requires payment for the current milestone's completed work, calculated on a pro-rata basis." },
      { heading: "Transition Support", text: "Upon cancellation, we provide full code handoff, documentation, and up to 5 hours of knowledge transfer to ensure a smooth transition to your new development team." },
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    label: "REFUNDS",
    sections: [
      { heading: "Eligibility", text: "Refunds are available for work that does not meet the agreed-upon specifications outlined in your project contract. Claims must be submitted within 14 days of deliverable handoff." },
      { heading: "Process", text: "Submit refund requests to hello@codeaxe.dev with your project details and a description of the discrepancy. We review all requests within 7 business days and work to resolve issues before processing refunds." },
      { heading: "Scope", text: "Refunds apply to the specific deliverable in question, not the entire project. If a deliverable requires revisions to meet specifications, we will complete those revisions at no additional cost before considering a refund." },
    ],
  },
};

const LegalPage = ({ type }: { type: string }) => {
  const data = legalContent[type] || legalContent.privacy;

  return (
    <>
      <div className="container py-24 md:py-32 max-w-3xl">
        <SectionHeader index="00" label={data.label} title={data.title} />
        <div className="space-y-12">
          {data.sections.map((s) => (
            <div key={s.heading} className="border-t border-border pt-8">
              <h3 className="text-lg font-display mb-3">{s.heading}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-16 font-mono-label">Last updated: March 2026</p>
      </div>
    </>
  );
};

export default LegalPage;
