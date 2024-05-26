import { Fragment } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from "@/components/layout/layout";
import RecipeForm from "@/components/recipes/recipeform";
import { useToast } from "@/context/ToastContext";
import apiRequest from '@/lib/apiRequest';

const NewRecipePage = () => {
    const router = useRouter();
    const { showToast } = useToast();
    const handleSubmit = async (formData) => {
        try {
            const response = await apiRequest('recipes', 'POST', formData);
            if (response.success) {
                router.push(`/recipes/${response.data._id}`);
                showToast('Success', 'Recipe created successfully', 'confirm');
            } else {
                showToast('Error', response.message, 'error');
            }
        } catch (error) {
            showToast('Error', 'Failed to create recipe', 'error');
        }
    };

    return (
        <Fragment>
            <Head>
                <title>New Recipe | Recipe Book</title>
                <meta name="description" content="Create a new recipe" />
            </Head>
            <Layout>
                <RecipeForm onSubmit={handleSubmit} submitButtonText="Create Recipe" />
            </Layout>
        </Fragment>
    );
}

export default NewRecipePage;
