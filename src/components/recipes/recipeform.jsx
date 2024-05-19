import { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeForm = ({ onSubmit, initialData = {}, submitButtonText = 'Submit' }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [ingredients, setIngredients] = useState(initialData.ingredients ? initialData.ingredients.join(',') : '');
    const [cookTime, setCookTime] = useState(initialData.cook_time || '');
    const [instructions, setInstructions] = useState(initialData.instructions || '');
    const [tags, setTags] = useState(initialData.tags ? initialData.tags.join(',') : '');
    const [photo, setPhoto] = useState(null);
    const [type, setType] = useState(initialData.type || 'Breakfast');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (initialData.photo) {
            setPhoto(initialData.photo);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = {};
        formData['title'] = title;
        formData['description'] = description;
        formData['ingredients'] = ingredients;
        formData['cook_time'] = cookTime;
        formData['instructions'] = instructions;
        formData['tags'] = tags.split(',');
        formData['type'] = type;

        try {
            await onSubmit(formData);
            setMessage('Recipe submitted successfully!');
        } catch (error) {
            setMessage('Error submitting recipe. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{initialData._id ? 'Update Recipe' : 'Create New Recipe'}</h1>
            {message && <p className="mb-4 text-center">{message}</p>}
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="ingredients" className="block text-gray-700">Ingredients (comma separated)</label>
                <input
                    type="text"
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="cook_time" className="block text-gray-700">Cook Time (minutes)</label>
                <input
                    type="number"
                    id="cook_time"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="instructions" className="block text-gray-700">Instructions</label>
                <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-700">Tags (comma separated)</label>
                <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="photo" className="block text-gray-700">Photo</label>
                <input
                    type="file"
                    id="photo"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700">Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{submitButtonText}</button>
        </form>
    );
};

export default RecipeForm;
