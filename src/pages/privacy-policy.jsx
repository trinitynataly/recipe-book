/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
Privacy Policy page for Recipe Book App
*/

// Import the Fragment component from React
import { Fragment } from "react";
// Import the Image component from Next.js for images
import Image from "next/image";
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";

/**
 * PrivacyPolicyPage component to display the privacy policy.
 * @returns {JSX.Element}
 */
export default function PrivacyPolicyPage() {
  // Return the privacy policy page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>Privacy Policy | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Privacy Policy for Recipe Book App" />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Privacy policy container */}
        <div className="container mx-auto px-4 py-8">
          <div className="w-full mb-8">
            {/* Privacy policy image */}
            <div className="relative w-full h-80 md:h-96 lg:h-96 xl:h-96 2xl:h-96 mb-4">  
              <Image 
                src="/privacy_policy.jpg" 
                alt="Privacy Policy for Recipe Book" 
                layout="fill" 
                objectFit="cover" 
                className="rounded-md" 
              />
            </div>
          </div>
          {/* Privacy policy title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-700">Privacy Policy</h1>
          {/* Privacy policy content */}
          <div className="text-gray-600 leading-relaxed">
            <p className="mb-4">
              Recipe Book is committed to providing quality services to you, and this policy outlines our ongoing obligations to you in respect of how we manage your Personal Information.
            </p>
            <p className="mb-4">
              We have adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) (the Privacy Act). The APPs govern the way in which we collect, use, disclose, store, secure, and dispose of your Personal Information.
            </p>
            <p className="mb-4">
              A copy of the Australian Privacy Principles may be obtained from the website of The Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" className="text-primary hover:text-tertiary">www.oaic.gov.au</a>.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">What is Personal Information and Why Do We Collect It?</h2>
            <p className="mb-4">
              Personal Information is information or an opinion that identifies an individual. Examples of Personal Information we collect include names, addresses, email addresses, phone numbers, and other contact details.
            </p>
            <p className="mb-4">
                This Personal Information is obtained in many ways including interviews, correspondence, by telephone, email, via our website <a href="https://www.RecipeBook.com" className="text-primary hover:text-tertiary">www.RecipeBook.com</a>, from your website, from media and publications, from other publicly available sources, from cookies, and from third parties. We don&apos;t guarantee website links or policies of authorized third parties.
            </p>
            <p className="mb-4">
              We collect your Personal Information for the primary purpose of providing our services to you, providing information to our clients, and marketing. We may also use your Personal Information for secondary purposes closely related to the primary purpose, in circumstances where you would reasonably expect such use or disclosure. You may unsubscribe from our mailing/marketing lists at any time by contacting us in writing.
            </p>
            <p className="mb-4">
              When we collect Personal Information, we will, where appropriate and where possible, explain to you why we are collecting the information and how we plan to use it.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Sensitive Information</h2>
            <p className="mb-4">
                Sensitive information is defined in the Privacy Act to include information or opinion about such things as an individual&apos;s racial or ethnic origin, political opinions, membership of a political association, religious or philosophical beliefs, membership of a trade union or other professional body, criminal record, or health information.
            </p>
            <p className="mb-4">
              Sensitive information will be used by us only:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>For the primary purpose for which it was obtained</li>
              <li>For a secondary purpose that is directly related to the primary purpose</li>
              <li>With your consent; or where required or authorized by law.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Third Parties</h2>
            <p className="mb-4">
              Where reasonable and practicable to do so, we will collect your Personal Information only from you. However, in some circumstances, we may be provided with information by third parties. In such a case we will take reasonable steps to ensure that you are made aware of the information provided to us by the third party.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Disclosure of Personal Information</h2>
            <p className="mb-4">
              Your Personal Information may be disclosed in a number of circumstances including the following:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Third parties where you consent to the use or disclosure; and</li>
              <li>Where required or authorized by law.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Security of Personal Information</h2>
            <p className="mb-4">
              Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from unauthorized access, modification, or disclosure.
            </p>
            <p className="mb-4">
              When your Personal Information is no longer needed for the purpose for which it was obtained, we will take reasonable steps to destroy or permanently de-identify your Personal Information. However, most of the Personal Information is or will be stored in client files which will be kept by us for a minimum of 7 years.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Access to Your Personal Information</h2>
            <p className="mb-4">
              You may access the Personal Information we hold about you and update and/or correct it, subject to certain exceptions. If you wish to access your Personal Information, please contact us in writing.
            </p>
            <p className="mb-4">
              Recipe Book will not charge any fee for your access request but may charge an administrative fee for providing a copy of your Personal Information.
            </p>
            <p className="mb-4">
              In order to protect your Personal Information, we may require identification from you before releasing the requested information.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Maintaining the Quality of Your Personal Information</h2>
            <p className="mb-4">
              It is important to us that your Personal Information is up to date. We will take reasonable steps to make sure that your Personal Information is accurate, complete, and up-to-date. If you find that the information we have is not up-to-date or is inaccurate, please advise us as soon as practicable so we can update our records and ensure we can continue to provide quality services to you.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Notifiable Data Breach Requirements</h2>
            <p className="mb-4">
                In accordance with the Notifiable Data Breach (NDB) Scheme under the Privacy Act 1988 (Cth), Recipe Book is required to notify individuals and the Office of the Australian Information Commissioner (OAIC) when a data breach is likely to result in serious harm to any individuals whose personal information is involved. A &apos;notifiable data breach&apos; occurs when there is unauthorized access to, unauthorized disclosure of, or loss of personal information held by Recipe Book and there is a likelihood that this may cause serious harm to one or more individuals. In the event of such a breach, Recipe Book must provide a statement to the OAIC containing the following: the identity and contact details of our organization, a description of the data breach, the kinds of information concerned, and recommendations about the steps that individuals should take in response to the data breach. Recipe Book will also directly notify affected individuals if feasible, providing them with similar information and guidance.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Policy Updates</h2>
            <p className="mb-4">
              This Policy may change from time to time and is available on our website.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Privacy Policy Complaints and Enquiries</h2>
            <p className="mb-4">
              If you have any queries or complaints about our Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Business email address:</strong> <a href="mailto:info@RecipeBook.com" className="text-primary hover:text-tertiary">info@owlphotography.com.au</a><br />
              <strong>Business phone number:</strong> <a href="tel:+61478947388" className="text-primary hover:text-tertiary">+61 478 947 388</a>
            </p>
          </div>
        </div>
      </Layout>
    </Fragment>
  )
}