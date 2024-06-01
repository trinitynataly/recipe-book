import { useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';


const RecipeForm = ({ onSubmit, initialData = {}, submitButtonText = 'Submit' }) => {
    console.log(initialData);
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [ingredients, setIngredients] = useState(initialData.ingredients ? initialData.ingredients : '');
    const [cookTime, setCookTime] = useState(initialData.cook_time || '');
    const [instructions, setInstructions] = useState(initialData.instructions || '');
    const [tags, setTags] = useState(initialData.tags ? initialData.tags.map(tag => tag.name).join(', ') : '');
    const [type, setType] = useState(initialData.type || 'Breakfast');

    const handleSubmit = async (e) => {
        e.preventDefault();       
        const formData = {
            title,
            description,
            ingredients,
            cook_time: cookTime,
            instructions,
            tags: tags.split(','),
            type
        };
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{initialData._id ? 'Update Recipe' : 'Create New Recipe'}</h1>
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
                <label htmlFor="ingredients" className="block text-gray-700">Ingredients</label>
                <ReactQuill
                    value={ingredients}
                    onChange={setIngredients}
                    theme="snow"
                    className="h-64"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="instructions" className="block text-gray-700">Instructions</label>
                <ReactQuill
                    value={instructions}
                    onChange={setInstructions}
                    theme="snow"
                    className="h-64"
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
            
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{submitButtonText}</button>
        </form>
    );
};

export default RecipeForm;
