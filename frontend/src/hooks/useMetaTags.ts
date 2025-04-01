// frontend/src/hooks/useMetaTags.ts
import { useEffect } from 'react';

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface Schema {
  [key: string]: any;
}

const useMetaTags = (title: string, metaTags: MetaTag[], schema?: Schema) => {
  useEffect(() => {
    // Update the document title
    document.title = title;

    // Add meta tags
    const tags: (HTMLMetaElement | HTMLLinkElement | HTMLScriptElement)[] = [];
    metaTags.forEach((tag) => {
      const meta = document.createElement('meta');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
      tags.push(meta);
    });

    // Add canonical link
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://roofgrid.uk'); // Update per page if needed
    document.head.appendChild(canonical);
    tags.push(canonical);

    // Add schema markup
    if (schema) {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      tags.push(script);
    }

    // Cleanup on unmount
    return () => {
      tags.forEach((tag) => document.head.removeChild(tag));
    };
  }, [title, metaTags, schema]); // Re-run if inputs change
};

export default useMetaTags;