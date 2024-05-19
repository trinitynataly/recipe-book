import { Fragment } from "react";
import withAuth from "@/middleware/withAuth";
import Layout from "@/components/layout/layout";
import RecipeForm from "@/components/recipes/recipeform";
import useApi from "@/hooks/useApi";

const NewRecipePage = () => {
    const apiRequest = useApi();
    const handleSubmit = async (formData) => {
        await apiRequest('recipes', 'POST', formData);
    };

    return (
        <Fragment>
            <Layout>
                <RecipeForm onSubmit={handleSubmit} submitButtonText="Create Recipe" />
            </Layout>
        </Fragment>
    );
}

export default withAuth(NewRecipePage, { isAdminRequired: false });
