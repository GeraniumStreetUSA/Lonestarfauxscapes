/**
 * /privacy: the old live page's text, carried over as written (brand
 * spelling fixed, the "Contact Form" link points at /contact).
 * /terms: rewritten 2026-11-04 at the owner's request, for Texas and to
 * protect the business first (owner: "edit it to be compliant for Texas and
 * protects us first and foremost"). Have a Texas attorney review before launch.
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
  updated: 'Last updated: November 4, 2026',
  intro: [
    'Lone Star Faux Scapes is a brand of Geranium Street USA, Inc. ("Lone Star Faux Scapes", "we", "us"). These Terms of Service ("Terms") apply to this website and to any estimate, quote or communication you receive from us. Please read them carefully.',
  ],
  sections: [
    {
      heading: '1. Agreement to These Terms',
      body: [
        'By using lonestarfauxscapes.com, using our estimator, or requesting a quote, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the website.',
        'Installation work is performed only under a separate written agreement, proposal or invoice that you sign or accept in writing ("Project Agreement"). If these Terms and a Project Agreement conflict, the Project Agreement controls.',
      ],
    },
    {
      heading: '2. Information on This Website',
      body: [
        'Everything on this website, including product descriptions, photos, drawings, starting prices, estimator results, guides and blog articles, is general information. It is not engineering, legal, building code, fire code or HOA advice, and it is not an offer to sell or install at any price.',
        'Photos and drawings illustrate products and past work; your finished project may differ in color, density, layout and appearance. We may correct errors and change information, products, prices and availability at any time without notice.',
      ],
    },
    {
      heading: '3. Estimates, Quotes and Pricing',
      body: [
        'Starting prices and estimator results are arithmetic illustrations based on published material starting prices. They are not quotes, and installation is not included.',
        'A rough quote is an estimate based on the measurements, photos and information you give us. It is not binding on either party. The final price is set only in your Project Agreement after a site review, and it may differ from any estimate because of:',
        [
          'Site conditions, access, slope or the condition of the surface the system mounts to',
          'Differences between the measurements you provide and the measured site',
          'Changes to scope, height, materials or layout',
          'Material, freight or supply cost changes',
          'Permits, inspections, HOA or landlord requirements, and fire documentation requirements',
        ],
        'Unless a quote states a different date, it expires 30 days after it is sent.',
      ],
    },
    {
      heading: '4. Project Agreements and Changes',
      body: [
        'Scope, price, schedule, payment terms and any warranty for a project are stated only in its Project Agreement. Any change to the work must be agreed in writing (email is enough) and may change the price and schedule.',
        'Schedules are estimates. We are not responsible for delays caused by weather, supply or shipping delays, site access, permit or HOA review, or other causes outside our reasonable control.',
      ],
    },
    {
      heading: '5. Payment',
      body: [
        'Payment terms are stated in your Project Agreement. Unless it says otherwise:',
        [
          'A deposit is required before materials are ordered or fabrication begins',
          'Custom and made-to-measure materials are non-refundable once ordered or fabricated, to the extent permitted by law',
          'The balance is due on completion of the installation',
          'Past-due amounts may accrue interest at the rate stated in the Project Agreement, never more than the maximum rate permitted by Texas law',
        ],
        'We reserve all rights available to us for unpaid work, including lien rights under Chapter 53 of the Texas Property Code.',
      ],
    },
    {
      heading: '6. Your Responsibilities',
      body: [
        'Unless your Project Agreement assigns a task to us, you are responsible for:',
        [
          'Giving us accurate measurements, photos and information',
          'Confirming property lines and that you own, or have the right to modify, the fence, wall or structure we install on',
          'Obtaining any HOA, landlord, property manager or neighbor approval. We can supply product information for your request, but we cannot promise that any association will approve it',
          'Obtaining permits and confirming building and fire code requirements with the authority having jurisdiction',
          'Marking private utilities and, where any digging or anchoring into the ground is planned, arranging a Texas 811 locate',
          'Providing safe, clear access to the work area',
        ],
        'We are not responsible for defects in, or failure of, existing fences, walls, wire mesh, posts or other structures that we did not build, or for damage caused by their condition.',
      ],
    },
    {
      heading: '7. Fire Documentation',
      body: [
        'Fire-rated options are built for NFPA 701. On request, we provide the test documentation available for the specific system you choose. Whether a product or its documentation satisfies the code requirements for your project is decided by the authority having jurisdiction (usually the local fire marshal or building official), not by us.',
      ],
    },
    {
      heading: '8. Warranty',
      body: [
        'The only warranties we give are the written warranties stated in your Project Agreement or in written product documentation we provide for your project.',
        {
          lead: 'DISCLAIMER OF OTHER WARRANTIES.',
          text: 'TO THE FULLEST EXTENT PERMITTED BY TEXAS LAW, THIS WEBSITE AND ITS CONTENT ARE PROVIDED "AS IS", AND WE DISCLAIM ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. NOTHING IN THESE TERMS LIMITS ANY WARRANTY OR RIGHT THAT TEXAS LAW DOES NOT ALLOW TO BE LIMITED.',
        },
        'Unless your written warranty says otherwise, no warranty covers damage from hail, wind, flood, fire or other severe weather or acts of God; misuse, impact or vandalism; cleaning methods or chemicals other than those we recommend; alterations or repairs by others; the condition or movement of the structure the system is mounted to; or normal weathering, including gradual color change from sun exposure.',
      ],
    },
    {
      heading: '9. Construction Defect Claims (Texas Property Code Chapter 27)',
      body: [
        'If you believe work we performed on your residence has a construction defect, Chapter 27 of the Texas Property Code may apply. Where it applies, you must send us written notice describing the defect in reasonable detail by certified mail, return receipt requested, at least 60 days before filing suit, and allow us to inspect the work and make a written offer to repair or settle, as Chapter 27 provides.',
      ],
    },
    {
      heading: '10. Limitation of Liability',
      body: [
        'TO THE FULLEST EXTENT PERMITTED BY TEXAS LAW:',
        [
          'We are not liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or for lost profits, lost use or loss of property value, arising from the website, any estimate or quote, or our products or services',
          'Our total liability for any claim arising from a project is limited to the amount you paid us for that project, and for any claim arising only from use of the website, to one hundred U.S. dollars',
        ],
        'These limits do not apply to liability that cannot be limited under Texas law, including liability for gross negligence or intentional misconduct.',
      ],
    },
    {
      heading: '11. Indemnification',
      body: [
        'You agree to indemnify and hold harmless Geranium Street USA, Inc., Lone Star Faux Scapes and their officers, employees and agents from claims, damages and expenses (including reasonable attorney fees) brought by third parties, such as an HOA, landlord or neighbor, that arise from your breach of these Terms, inaccurate information you gave us, or work performed at your direction on property or structures you did not have the right to modify, except to the extent caused by our own negligence.',
      ],
    },
    {
      heading: '12. Photos of Completed Work',
      body: [
        'We may photograph completed installations and use the photos in our marketing. We will not publish your name or street address without your permission. To opt out, tell us in writing before or after your installation.',
      ],
    },
    {
      heading: '13. Communications',
      body: [
        'When you send us a request, you agree that we may contact you by phone, text message or email about that request and your project. We do not sell your contact information. Message and data rates may apply to texts; you may ask us to stop at any time.',
      ],
    },
    {
      heading: '14. Intellectual Property and Website Use',
      body: [
        'All content on this website, including text, photos, drawings, designs, logos and graphics, belongs to Geranium Street USA, Inc. or its licensors and is protected by copyright and trademark law. You may not copy, republish or use it commercially without our written permission.',
        'You agree to use the website only for lawful purposes and not to:',
        [
          'Infringe the rights of others',
          "Restrict or inhibit anyone else's use of the website",
          'Attempt to gain unauthorized access to our systems',
          'Transmit harmful code or malware, or submit automated or false requests',
        ],
        'Links to other websites are for convenience; we are not responsible for their content.',
      ],
    },
    {
      heading: '15. Governing Law and Disputes',
      body: [
        'These Terms and any dispute about the website, an estimate, a quote or a project are governed by the laws of the State of Texas, without regard to conflict-of-law rules.',
        'Before filing any claim, each party agrees to try in good faith to resolve the dispute by written notice and discussion for at least 30 days (or the longer period Chapter 27 requires, where it applies). Any lawsuit must be filed in the state or federal courts for the Texas county where the project is located or, if there is no project, the county of our principal Texas office, and each party consents to that venue.',
      ],
    },
    {
      heading: '16. General',
      body: [
        'We may update these Terms by posting a new version on this page with a new "Last updated" date; the version in effect when you sign a Project Agreement applies to that project. If any provision is found unenforceable, it will be enforced to the maximum extent permitted and the rest of these Terms remain in effect. Our failure to enforce a provision is not a waiver. These Terms and any Project Agreement are the entire agreement between us on their subject.',
      ],
    },
    {
      heading: '17. Contact Information',
      body: [
        'Questions about these Terms? Contact Lone Star Faux Scapes, a brand of Geranium Street USA, Inc.:',
        [
          { before: 'Phone: ', link: PHONE_LINK },
          { before: 'Email: ', link: { text: 'info@lonestarfauxscapes.com', href: 'mailto:info@lonestarfauxscapes.com' } },
          { before: 'Website: ', link: FORM_LINK },
        ],
      ],
    },
  ],
};
