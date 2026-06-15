let recipeData = null;

// Load JSON data
fetch('data/recipes.json')
  .then(response => response.json())
  .then(data => {
    recipeData = data;
    renderCountries();
  })
  .catch(error => {
    console.error('Error loading recipes:', error);
    document.getElementById('country-grid').innerHTML = '<p>Error loading recipes. Please check that recipes.json is in the data folder.</p>';
  });

// ----- VIEW SWITCHING -----
function showView(viewId) {
  document.getElementById('home-view').classList.add('hidden');
  document.getElementById('country-view').classList.add('hidden');
  document.getElementById('recipe-view').classList.add('hidden');
  document.getElementById(viewId).classList.remove('hidden');
}

function showHome() {
  showView('home-view');
  updateBreadcrumb([{ label: 'Home', action: 'showHome()' }]);
}

function showCountry(countryId) {
  const country = recipeData.countries.find(c => c.id === countryId);
  if (!country) return;

  document.getElementById('country-title').textContent = `${country.flag} ${country.name} Recipes`;

  const grid = document.getElementById('recipe-grid');
  grid.innerHTML = '';
  country.recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => showRecipe(countryId, recipe.id);
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/placeholder.svg'">
      <div class="recipe-card-body">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <div class="recipe-meta">⏱ ${recipe.prepTime} prep • ${recipe.cookTime} cook</div>
      </div>
    `;
    grid.appendChild(card);
  });

  showView('country-view');
  updateBreadcrumb([
    { label: 'Home', action: 'showHome()' },
    { label: `${country.flag} ${country.name}`, action: `showCountry('${countryId}')` }
  ]);
}

function showRecipe(countryId, recipeId) {
  const country = recipeData.countries.find(c => c.id === countryId);
  const recipe = country.recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const detail = document.getElementById('recipe-detail');
  detail.innerHTML = `
    <button class="back-button" onclick="showCountry('${countryId}')">&larr; Back to ${country.name} Recipes</button>
    <div class="recipe-detail-header">
      <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/placeholder.svg'">
      <div class="recipe-detail-header-info">
        <h2>${recipe.name}</h2>
        <p class="description">${recipe.description}</p>
        <div class="recipe-stats">
          <div class="recipe-stat">
            <div class="label">Prep Time</div>
            <div class="value">${recipe.prepTime}</div>
          </div>
          <div class="recipe-stat">
            <div class="label">Cook Time</div>
            <div class="value">${recipe.cookTime}</div>
          </div>
          <div class="recipe-stat">
            <div class="label">Servings</div>
            <div class="value">${recipe.servings}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="recipe-body">
      <div class="recipe-section">
        <h3>Ingredients</h3>
        <ul class="ingredients-list">
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      <div class="recipe-section">
        <h3>Instructions</h3>
        <ol class="steps-list">
          ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    </div>
  `;

  showView('recipe-view');
  updateBreadcrumb([
    { label: 'Home', action: 'showHome()' },
    { label: `${country.flag} ${country.name}`, action: `showCountry('${countryId}')` },
    { label: recipe.name, action: `showRecipe('${countryId}', '${recipeId}')` }
  ]);
}

// ----- RENDER HOME (COUNTRY GRID) -----
function renderCountries() {
  const grid = document.getElementById('country-grid');
  grid.innerHTML = '';
  recipeData.countries.forEach(country => {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.onclick = () => showCountry(country.id);
    card.innerHTML = `
      <span class="country-flag">${country.flag}</span>
      <div class="country-name">${country.name}</div>
      <div class="country-count">${country.recipes.length} recipes</div>
    `;
    grid.appendChild(card);
  });
}

// ----- BREADCRUMB -----
function updateBreadcrumb(items) {
  const breadcrumb = document.getElementById('breadcrumb');
  breadcrumb.innerHTML = items.map((item, index) => {
    const link = `<a href="#" onclick="${item.action}; return false;">${item.label}</a>`;
    return index < items.length - 1 ? link + '<span class="breadcrumb-sep">/</span>' : link;
  }).join('');
}
