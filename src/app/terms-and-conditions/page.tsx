export const metadata = {
  title: "terms and conditions | attn:seeker",
  description:
    "terms of use for the attention seeker website and services.",
};

const TERMS_SECTIONS = [
  {
    title: "acceptance of terms",
    paragraphs: [
      'By accessing and using the attnseeker.com website and associated services operated by The Attention Seeker Limited ("we", "us", "our"), you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, you should not use our website or services.',
      "We reserve the right to modify these terms at any time. Changes will be effective when posted on this page with an updated revision date.",
    ],
  },
  {
    title: "services",
    paragraphs: [
      "The Attention Seeker provides organic social media strategy, content creation, community management, and social media management services for businesses. We also operate a newsletter (\"Your Attention Please\"), a loyalty programme (\"Seekers\"), and educational content through our website.",
      "We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.",
    ],
  },
  {
    title: "accounts",
    paragraphs: [
      "Some features of our website require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms or that have been inactive for an extended period.",
    ],
  },
  {
    title: "seekers programme",
    paragraphs: [
      "The Seekers loyalty programme is subject to its own rules and conditions. Points and rewards have no cash value and cannot be transferred or exchanged outside of the programme. We reserve the right to modify the programme structure, point values, and available rewards at any time.",
      "Abuse of the programme, including manipulation of points or fraudulent activity, may result in account suspension and forfeiture of accumulated points and rewards.",
    ],
  },
  {
    title: "intellectual property",
    paragraphs: [
      "All content on this website, including text, graphics, logos, images, and software, is the property of The Attention Seeker Limited or its content suppliers and is protected by New Zealand and international copyright laws.",
      "You may not reproduce, distribute, modify, or create derivative works from any content on this website without our express written permission. Our newsletter content is provided for personal use only and may not be redistributed without permission.",
    ],
  },
  {
    title: "user content",
    paragraphs: [
      "By submitting content to our website, including comments, feedback, and game scores, you grant us a non-exclusive, royalty-free, worldwide licence to use, reproduce, and display that content in connection with our services.",
      "You are solely responsible for any content you submit and agree not to submit content that is unlawful, offensive, or infringes on the rights of others.",
    ],
  },
  {
    title: "limitation of liability",
    paragraphs: [
      'Our website and services are provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the reliability, accuracy, or availability of our services.',
      "To the fullest extent permitted by law, The Attention Seeker Limited shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.",
    ],
  },
  {
    title: "governing law",
    paragraphs: [
      "These terms are governed by and construed in accordance with the laws of New Zealand. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of New Zealand.",
    ],
  },
  {
    title: "contact us",
    paragraphs: [
      "If you have any questions about these terms and conditions, please contact us at hello@attnseeker.com.",
      "The Attention Seeker Limited, Auckland, New Zealand.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <section className="bg-bone px-6 py-16">
        <div className="mx-auto max-w-[800px]">
          <h1 className="font-obviously-wide text-4xl font-bold">
            terms and conditions
          </h1>
          <p className="mt-3 font-obviously text-xs text-black/40">
            last updated: march 2026
          </p>
        </div>
      </section>

      <section className="bg-bone px-6 pb-20">
        <div className="mx-auto max-w-[800px]">
          {TERMS_SECTIONS.map((section, i) => (
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
