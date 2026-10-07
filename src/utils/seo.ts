import { CalculatorDef } from '../types/calculator';

export const updateSEO = (calc?: CalculatorDef, categoryName?: string) => {
  const baseTitle = 'CalcHub | All-in-One Online Calculator Platform';
  let title = baseTitle;
  let description = 'Free, fast, and accurate online calculators for math, finance, health, geometry, construction, physics, chemistry, date & time, and unit conversions.';
  let canonicalUrl = window.location.origin + window.location.pathname;

  if (calc) {
    title = `${calc.title} - Free Online Calculator | CalcHub`;
    description = `${calc.shortDesc} Accurate calculations with formula, step-by-step instructions, and real-world examples.`;
  } else if (categoryName) {
    title = `${categoryName} Calculators - Free Online Tools | CalcHub`;
    description = `Explore our collection of free, fast, and accurate ${categoryName.toLowerCase()} online calculators.`;
  }

  document.title = title;

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Update Open Graph
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  // Update Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', canonicalUrl);

  // Update Dynamic JSON-LD Structured Data
  let existingScript = document.getElementById('dynamic-schema');
  if (existingScript) existingScript.remove();

  if (calc) {
    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: calc.title,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        url: window.location.href,
        description: calc.shortDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    ];

    if (calc.faqs && calc.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: calc.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }

    const script = document.createElement('script');
    script.id = 'dynamic-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);
  }
};
