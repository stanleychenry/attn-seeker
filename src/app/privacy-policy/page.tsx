export const metadata = {
  title: "privacy policy | attn:seeker",
  description: "how we handle your data at the attention seeker.",
};

const PRIVACY_SECTIONS = [
  {
    title: "introduction",
    paragraphs: [
      'The Attention Seeker Limited ("we", "us", "our") operates the attnseeker.com website and associated services. This privacy policy explains how we collect, use, and protect your personal information when you use our website and services.',
      "By using our website, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    title: "information we collect",
    paragraphs: [
      "We collect information you provide directly to us, including your name, email address, and any other information you choose to provide when subscribing to our newsletter, creating a Seekers account, contacting us through our website, or engaging with our services.",
      "We also collect certain information automatically when you visit our website, including your IP address, browser type, referring URLs, pages viewed, and the dates and times of your visits. We use cookies and similar tracking technologies to collect this information.",
    ],
  },
  {
    title: "how we use your information",
    paragraphs: [
      "We use the information we collect to provide, maintain, and improve our services, to send you our newsletter and other communications you have opted into, to respond to your enquiries and requests, to monitor and analyse usage trends, and to personalise your experience on our website.",
      "We may also use your information to send you promotional content about our services. You can opt out of these communications at any time by clicking the unsubscribe link in any email or contacting us directly.",
    ],
  },
  {
    title: "cookies and tracking",
    paragraphs: [
      "We use cookies and similar technologies to enhance your experience on our website. These include essential cookies required for the website to function, analytics cookies that help us understand how visitors interact with our site, and preference cookies that remember your settings and choices.",
      "You can control cookie settings through your browser preferences. Disabling certain cookies may affect the functionality of our website.",
    ],
  },
  {
    title: "third-party services",
    paragraphs: [
      "We use third-party services to help operate our website and deliver our services. These include email service providers, analytics platforms, payment processors, and hosting services. These third parties may have access to your personal information only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.",
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.",
    ],
  },
  {
    title: "data retention and security",
    paragraphs: [
      "We retain your personal information for as long as necessary to provide our services and fulfil the purposes described in this policy. We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.",
      "While we strive to protect your personal information, no method of transmission over the internet or electronic storage is completely secure.",
    ],
  },
  {
    title: "your rights",
    paragraphs: [
      "Depending on your location, you may have the right to access, correct, or delete your personal information, to object to or restrict processing of your data, to data portability, and to withdraw consent where processing is based on consent.",
      "If you are located in New Zealand, you have rights under the Privacy Act 2020. If you are located in the European Economic Area, you have rights under the GDPR. If you are located in Australia, you have rights under the Australian Privacy Act 1988.",
    ],
  },
  {
    title: "contact us",
    paragraphs: [
      "If you have any questions about this privacy policy or our data practices, please contact us at hello@attnseeker.com.",
      "The Attention Seeker Limited, Auckland, New Zealand.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-bone px-6 py-16">
        <div className="mx-auto max-w-[800px]">
          <h1 className="font-obviously-wide text-4xl font-bold">
            privacy policy
          </h1>
          <p className="mt-3 font-obviously text-xs text-black/40">
            last updated: march 2026
          </p>
        </div>
      </section>

      <section className="bg-bone px-6 pb-20">
        <div className="mx-auto max-w-[800px]">
          {PRIVACY_SECTIONS.map((section, i) => (
            <div key={i} className={i > 0 ? "mt-10" : ""}>
              <h2 className="mb-3 font-obviously-wide text-base font-semibold">
                {section.title}
              </h2>
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="mb-4 font-tiempos-text text-base leading-relaxed text-black/80"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
