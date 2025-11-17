import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const APP_NAME = "Swalaxon Remedies";

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Services', href: '/services' },
  { name: 'Quality', href: '/quality' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact Us', href: '/contact' },
];

export const FOOTER_LINKS = {
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Refund & Replacement Policy', href: '#' },
  ],
};

export const CONTACT_DETAILS = {
  address: "Swalaxon Remedies Pvt. Ltd.\n(Nagpur, Maharashtra)",
  phone: "+91-9876543210",
  email: "info@swalaxonremedies.com",
  careersEmail: "careers@swalaxonremedies.com",
};

export const HOMEPAGE_CONTENT = {
  hero: {
    title: "Innovating Healthcare. Delivering Trust.",
    subtitle: "A next-generation pharmaceutical company committed to quality, affordability, and global healthcare excellence.",
    cta: {
      primary: { name: 'Explore Our Products', href: '/products' },
      secondary: { name: 'Connect With Us', href: '/contact' },
    },
  },
  whyChooseUs: {
    title: "Why Choose Us",
    reasons: [
      "WHO-GMP Compliant Manufacturing",
      "High-Quality Formulations",
      "Trusted by Healthcare Professionals",
      "Ethical Business Practices",
      "PAN-India Distribution Network",
    ],
  },
  productSegments: {
    title: "Key Product Segments",
    segments: [
      "General Medicines",
      "Gastro & Hepatic Care",
      "Pain Management",
      "Vitamins & Nutraceuticals",
      "Anti-infectives",
      "Cardiac & Diabetic Care",
      "ENT / Pediatric Formulations",
    ],
  },
};

export const ABOUT_PAGE_CONTENT = {
  title: "About Swalaxon Remedies Pvt. Ltd.",
  description: "Swalaxon Remedies Pvt. Ltd. is a fast-growing Indian pharmaceutical organization founded with a mission to deliver high-quality, affordable, and reliable healthcare solutions. We specialize in ethical marketing, innovative formulations, and end-to-end pharma services including sourcing, development, and supply.\n\nWe operate with a commitment to integrity, scientific excellence, and patient-well-being. With a strong distribution network and a diverse product portfolio, we aim to become a trusted healthcare partner across India and international markets.",
  mission: {
    title: "Our Mission",
    text: "To transform healthcare through safe, effective, and affordable pharmaceutical products that improve the quality of life.",
  },
  vision: {
    title: "Our Vision",
    text: "To become a globally recognized pharmaceutical company known for trust, innovation, and excellence in healthcare.",
  },
  values: {
    title: "Our Values",
    list: [
      { name: "Integrity", description: "Ethical business practices" },
      { name: "Quality", description: "Zero-compromise manufacturing" },
      { name: "Innovation", description: "Advancing formulations" },
      { name: "Commitment", description: "Patient-first approach" },
      { name: "Excellence", description: "Delivering industry-leading results" },
    ],
  },
};

export const PRODUCTS_PAGE_CONTENT = {
  title: "Our Products",
  categories: [
    {
      name: "Tablets",
      products: [
        { name: "Paracetamol 650 mg", description: "Pain & Fever Relief. Effective and safe analgesic formulated for fast action and high patient compliance." },
        { name: "Pantoprazole 40 mg", description: "Antacid / Gastric Relief. High-purity PPI for long-lasting protection from acidity and GERD." },
        { name: "Cefixime 200 mg", description: "Antibiotic. Broad-spectrum antibacterial action for bacterial infections." },
      ],
      image: PlaceHolderImages.find(img => img.id === 'product-tablet') as ImagePlaceholder,
    },
    {
      name: "Capsules",
      products: [
        { name: "Vitamin D3 60k Softgel", description: "Bone Health. Premium-quality supplements designed for maximum absorption." },
        { name: "Omega-3 Fatty Acids", description: "Heart & Brain Health. Sourced from pure fish oil for optimal benefits." },
      ],
      image: PlaceHolderImages.find(img => img.id === 'product-capsule') as ImagePlaceholder,
    },
    {
      name: "Liquids & Syrups",
      products: [
        { name: "Cough Syrup", description: "Respiratory Relief. A soothing formula for dry and productive coughs." },
      ],
      image: PlaceHolderImages.find(img => img.id === 'product-syrup') as ImagePlaceholder,
    },
    { name: "Dry Syrups", products: [], image: PlaceHolderImages.find(img => img.id === 'product-syrup') as ImagePlaceholder, },
    { name: "Injectables", products: [], image: PlaceHolderImages.find(img => img.id === 'product-tablet') as ImagePlaceholder, },
    { name: "Ointments & Topicals", products: [], image: PlaceHolderImages.find(img => img.id === 'product-capsule') as ImagePlaceholder, },
    { name: "Nutraceuticals", products: [], image: PlaceHolderImages.find(img => img.id === 'product-capsule') as ImagePlaceholder, },
    { name: "Ayurvedic & Herbal Range", products: [], image: PlaceHolderImages.find(img => img.id === 'product-syrup') as ImagePlaceholder, },
  ],
};

export const SERVICES_PAGE_CONTENT = {
  title: "Our Core Services",
  services: [
    { name: "Ethical Marketing", description: "High-quality branded medicines promoted through a strong field force and ethical practices." },
    { name: "Third-Party Manufacturing Support", description: "Complete assistance in sourcing WHO-GMP certified manufacturers for your product line." },
    { name: "Product Development", description: "Customized new formulations and brand building." },
    { name: "Distribution & Supply Chain", description: "Fast, efficient, and transparent logistics across India." },
  ],
};

export const QUALITY_PAGE_CONTENT = {
  title: "Our Commitment to Quality",
  description: "Swalaxon Remedies maintains strict quality protocols and partners only with WHO-GMP, ISO-certified manufacturing units.",
  checks: [
    "Raw material testing",
    "In-process quality control",
    "Final batch analysis",
    "Stability testing",
    "Packaging validation",
  ],
  focus: "Our focus is safe, effective, and compliant healthcare.",
};

export const CAREERS_PAGE_CONTENT = {
  title: "Join Our Team",
  description: "We are always looking for passionate people in:",
  roles: [
    "Pharma Marketing",
    "Sales Management",
    "Supply Chain",
    "Quality & Regulatory",
    "Admin & Operations",
  ],
  cta: "Send your resume:",
};

export const SEO_PACK = {
  primaryKeywords: [
    "Swalaxon Remedies Pvt Ltd",
    "Pharmaceutical company in India",
    "Pharma products manufacturer",
    "Ethical pharma marketing company",
    "Third-party pharma manufacturing services",
  ],
  secondaryKeywords: [
    "Best pharma company in Nagpur",
    "GMP certified pharma products",
    "High quality medicine manufacturer",
    "Pharma franchise opportunities",
    "Nutraceutical manufacturers India",
  ],
};
