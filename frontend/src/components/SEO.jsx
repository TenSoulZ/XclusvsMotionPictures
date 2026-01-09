import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, schemaData }) => {
    const siteTitle = "Xclusvs Motion Pictures";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = "Professional cinematography and photography services in Harare, Zimbabwe. Capturing your best moments with cinematic excellence.";
    const metaDescription = description || defaultDescription;
    const siteUrl = "https://xclusvsmotionpictures.com"; // Replace with actual URL
    const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={metaDescription} />
            {keywords && <meta name='keywords' content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:url" content={canonicalUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {image && <meta name="twitter:image" content={image} />}

            {/* JSON-LD Structured Data */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}
        </Helmet>
    );
};


export default SEO;
