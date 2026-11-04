/**
 * /privacy and /terms: the old live pages' text, carried over as written.
 * Changes: brand spelling, the "Contact Form" link now points at /contact,
 * and the headings and lists are data. No new legal claims were added.
 */

/** A paragraph or list item: plain, led by a bold label, or ending in a link. */
export type LegalText =
  | string
  | { lead: string; text: string }
  | { before: string; link: { text: string; href: string } };

/** A string array is a bulleted list; anything else is a paragraph. */
export type LegalBlock = LegalText | readonly LegalText[];

export interface LegalSection {
  heading: string;
  body: readonly LegalBlock[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: readonly LegalText[];
  sections: readonly LegalSection[];
}

const PHONE_LINK = { text: '(760) 978-7335', href: 'tel:+17609787335' } as const;
const FORM_LINK = { text: 'Contact Form', href: '/contact' } as const;

export const PRIVACY: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'Last updated: December 11, 2025',
  intro: [
    'Lone Star Faux Scapes ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.',
  ],
  sections: [
    {
      heading: 'Information We Collect',
      body: [
        'We collect information you provide directly to us, including:',
        [
          { lead: 'Contact Information:', text: 'Name, email address, phone number when you submit our contact form' },
          { lead: 'Project Details:', text: 'Information about your project requirements and preferences' },
          { lead: 'Communications:', text: 'Records of correspondence when you contact us' },
        ],
        'We automatically collect certain information when you visit our website:',
        [
          'Browser type and version',
          'Operating system',
          'Pages visited and time spent',
          'Referring website',
          'IP address (anonymized)',
        ],
      ],
    },
    {
      heading: 'How We Use Your Information',
      body: [
        'We use the information we collect to:',
        [
          'Respond to your inquiries and provide quotes',
          'Communicate about our services and your projects',
          'Improve our website and services',
          'Send occasional updates about our services (with your consent)',
          'Comply with legal obligations',
        ],
      ],
    },
    {
      heading: 'Information Sharing',
      body: [
        'We do not sell, trade, or rent your personal information to third parties. We may share your information with:',
        [
          {
            lead: 'Service Providers:',
            text: 'Third-party services that help us operate our website (e.g., email services, analytics)',
          },
          { lead: 'Legal Requirements:', text: 'When required by law or to protect our rights' },
        ],
      ],
    },
    {
      heading: 'Data Security',
      body: [
        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
        {
          lead: 'Note:',
          text: 'No method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.',
        },
      ],
    },
    {
      heading: 'Cookies and Tracking',
      body: [
        'Our website may use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings. Disabling cookies may affect some website functionality.',
      ],
    },
    {
      heading: 'Third-Party Services',
      body: [
        'Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.',
      ],
    },
    {
      heading: 'Your Rights',
      body: [
        'You have the right to:',
        [
          'Access the personal information we hold about you',
          'Request correction of inaccurate information',
          'Request deletion of your information',
          'Opt out of marketing communications',
        ],
      ],
    },
    {
      heading: "Children's Privacy",
      body: [
        'Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.',
      ],
    },
    {
      heading: 'Changes to This Policy',
      body: [
        'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.',
      ],
    },
    {
      heading: 'Contact Us',
      body: [
        'If you have questions about this Privacy Policy or our practices, please contact us:',
        [
          { before: 'Phone: ', link: PHONE_LINK },
          { before: 'Website: ', link: FORM_LINK },
        ],
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  title: 'Terms of Service',
  updated: 'Last updated: December 11, 2025',
  intro: [
    'Welcome to Lone Star Faux Scapes. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.',
  ],
  sections: [
    {
      heading: '1. Acceptance of Terms',
      body: [
        'By accessing our website at lonestarfauxscapes.com or engaging our services, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our website or services.',
      ],
    },
    {
      heading: '2. Services',
      body: [
        'Lone Star Faux Scapes provides design, fabrication, and installation services for artificial hedges, faux living walls, fence extensions, and related products. Our services include:',
        [
          'Custom design consultation',
          'Product fabrication and customization',
          'Professional installation',
          'Commercial and residential projects',
        ],
      ],
    },
    {
      heading: '3. Quotes and Pricing',
      body: [
        'All quotes provided are estimates based on the information available at the time. Final pricing may vary based on:',
        [
          'Site conditions discovered during installation',
          'Changes to project scope',
          'Material availability and pricing fluctuations',
          'Additional work requested by the client',
        ],
        'Quotes are valid for 30 days unless otherwise specified.',
      ],
    },
    {
      heading: '4. Project Agreements',
      body: [
        'Specific project terms, including pricing, timeline, and scope, will be detailed in a separate written agreement or proposal. That agreement, along with these Terms, governs our relationship for that project.',
      ],
    },
    {
      heading: '5. Payment Terms',
      body: [
        'Payment terms will be specified in your project agreement. Generally:',
        [
          'A deposit is required to begin work',
          'Progress payments may be required for larger projects',
          'Final payment is due upon project completion',
        ],
      ],
    },
    {
      heading: '6. Warranty',
      body: [
        'We stand behind our work. Specific warranty terms vary by product and will be provided in your project agreement. Our warranties typically cover:',
        ['Workmanship defects', 'Material defects under normal use', 'Structural integrity of installations'],
        {
          lead: 'Note:',
          text: 'Warranties do not cover damage from improper use, modifications, extreme weather events, or normal wear and tear. UV degradation timelines vary by product exposure.',
        },
      ],
    },
    {
      heading: '7. Intellectual Property',
      body: [
        'All content on our website, including text, images, designs, logos, and graphics, is the property of Lone Star Faux Scapes and protected by copyright and trademark laws. You may not reproduce, distribute, or use our content without written permission.',
      ],
    },
    {
      heading: '8. Website Use',
      body: [
        'You agree to use our website only for lawful purposes and in a way that does not:',
        [
          'Infringe the rights of others',
          "Restrict or inhibit anyone else's use of the website",
          'Attempt to gain unauthorized access to our systems',
          'Transmit harmful code or malware',
        ],
      ],
    },
    {
      heading: '9. Limitation of Liability',
      body: [
        'To the fullest extent permitted by law, Lone Star Faux Scapes shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.',
      ],
    },
    {
      heading: '10. Indemnification',
      body: [
        'You agree to indemnify and hold harmless Lone Star Faux Scapes, its officers, employees, and agents from any claims, damages, or expenses arising from your violation of these Terms or misuse of our services.',
      ],
    },
    {
      heading: '11. Governing Law',
      body: [
        'These Terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts of Texas.',
      ],
    },
    {
      heading: '12. Changes to Terms',
      body: [
        'We may modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our website or services constitutes acceptance of the modified Terms.',
      ],
    },
    {
      heading: '13. Severability',
      body: [
        'If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.',
      ],
    },
    {
      heading: '14. Contact Information',
      body: [
        'For questions about these Terms, please contact us:',
        [
          { before: 'Phone: ', link: PHONE_LINK },
          { before: 'Website: ', link: FORM_LINK },
        ],
      ],
    },
  ],
};
