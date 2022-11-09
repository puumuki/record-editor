import {markdown} from 'markdown';

/**
 * Format recipe object and gives it a title for listing.
 * @param {object} recipe recipe object
 * @returns {object} formatted recipe object
 */
 function formatRecipe( recipe ) {
  recipe.title = recipe.markdown.split('\n')[0];
  recipe.slug = recipe.name;  
  recipe.html = markdown.toHTML( recipe.markdown );
  return recipe;
}

/**
 * Load recipes from server 
 * @returns {object[]} recipes
 */
export async function loadRecipes() {    
  const res = await fetch('http://192.168.8.200:9001/api/v2/recipes');
  const recipes = await res.json();  
  return recipes.map( formatRecipe );  
}

