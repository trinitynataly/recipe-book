import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Correct the path to point to src/data
      const filePath = path.join(process.cwd(), 'src', 'data', 'recipes.json');
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const recipes = JSON.parse(jsonData);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Error reading the recipes data.", error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
