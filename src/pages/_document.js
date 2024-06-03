/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 02/04/2024
Document component for the HTML document structure
*/

// Import the Html, Head, Main, and NextScript components from Next.js
import { Html, Head, Main, NextScript } from "next/document";

/**
 * Document component to define the HTML document structure.
 * @returns {JSX.Element}
 */
export default function Document() {
  return (
    <Html lang="en">
      {/* Head component for the document head */}
      <Head>
        <link rel="icon" href="/recipe_book_icon.png" />
      </Head>
      {/* Body component for the document body */}
      <body>
        {/* Main component for the document body */}
        <Main />
        {/* NextScript component for the document scripts */}
        <NextScript />
      </body>
    </Html>
  );
}
