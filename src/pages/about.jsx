/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 27/05/2024
About page for the Recipe Book app
*/

// Import the Fragment component from React
import { Fragment } from "react";
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Image component from Next.js
import Image from "next/image";
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";

/**
 * AboutPage component to display the about page for the Recipe Book app.
 * @returns {JSX.Element}
 */
const AboutPage = () => {
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>About | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Welcome to Recipe Book App" />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* About page container */}
        <div className="container mx-auto px-4 py-8">
          <div className="w-full mb-8">
            {/* About page image */}
            <div className="relative w-full h-80 md:h-96 lg:h-96 xl:h-96 2xl:h-96 mb-4">  
              <Image 
                src="/about.jpg" 
                alt="About Recipe Book" 
                layout="fill" 
                objectFit="cover" 
                className="rounded-md"
                priority={false}
                quality={75}
              />
            </div>
          </div>
          {/* About page title */}
          <h1 className="text-3xl font-bold mb-4 text-gray-700">About Recipe Book</h1>
          {/* About page content */}
          <div className="text-gray-600 leading-relaxed">
            <p className="mb-4">
              Welcome to Recipe Book, your ultimate companion in the kitchen! Our app is designed to make cooking easier, more enjoyable, and more organized. Whether you&apos;re a seasoned chef or a kitchen novice, Recipe Book has something for everyone. From delicious breakfast ideas to hearty dinners, our app offers a wide variety of recipes to suit all tastes and dietary needs.
            </p>
            <p className="mb-4">
              At Recipe Book, we believe that cooking should be a joyful experience. That&apos;s why we&apos;ve included features that help you plan your meals, save your favorite recipes, and even share your culinary creations with others. Our user-friendly interface makes it simple to search for recipes, follow step-by-step instructions, and get inspired by new dishes every day.
            </p>
            <p className="mb-4">
              Our app is built with Next.js, Tailwind CSS, and Sass, ensuring a seamless and responsive user experience. The combination of these technologies allows us to provide a fast, reliable, and visually appealing platform for all your cooking needs. We are constantly updating our app with new recipes and features to keep your culinary adventures exciting and fresh.
            </p>
            <p className="mb-4">
              One of the unique features of Recipe Book is the ability for our users to add their own recipes. This means you can share your family secrets and culinary experiments with the community. By creating a personalized collection of your recipes, you can easily access and organize them whenever you want.
            </p>
            <p className="mb-4">
              Our &apos;Favorites&apos; feature allows you to save recipes you love, making it easy to find them later. Whether it&apos;s a complex holiday meal or a simple weeknight dinner, you can keep all your favorite recipes in one convenient place.
            </p>
            <p className="mb-4">
              Recipe Book also includes a blog section filled with interesting articles, cooking tips, and food trends. Our blog is designed to inspire and educate, helping you expand your culinary knowledge and skills. From exploring different cuisines to discovering new cooking techniques, our blog has something for every food enthusiast.
            </p>
            <p className="mb-4">
              We understand the importance of dietary preferences and restrictions, which is why Recipe Book includes a variety of filters and categories to help you find recipes that fit your lifestyle. From gluten-free breakfasts to vegan dinners, our app caters to all dietary requirements, ensuring that everyone can enjoy delicious meals.
            </p>
            <p>
              <i>Thank you for choosing Recipe Book as your go-to cooking app. We are dedicated to helping you discover new recipes, improve your cooking skills, and enjoy the process of making and sharing food. Happy cooking!</i>
            </p>
          </div>
        </div>
      </Layout>
    </Fragment>
  )
}
// Export the AboutPage component
export default AboutPage;
