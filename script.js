document.addEventListener("DOMContentLoaded", () => {
    const itemsGrid = document.getElementById("items-grid");
    const mainPage = document.getElementById("main-page");
    const craftPage = document.getElementById("craft-page");
    const ingredientsStage = document.getElementById("ingredients-stage");
    const resultStage = document.getElementById("result-stage");

    fetch('items.json')
        .then(res => res.json())
        .then(data => {
            const db = data.database; // Onde estão as fotos e nomes reais

            data.craftables.forEach(craftItem => {
                // Busca os dados do item final no banco de dados
                const itemData = db[craftItem.id];
                
                const card = document.createElement("div");
                card.classList.add("item-card");
                
                card.innerHTML = `
                    <img src="${itemData.image}">
                    <h3>${itemData.name}</h3>
                    <div class="tooltip">
                        <div style="font-size: 11px; color: var(--accent-green); margin-bottom: 10px; border-bottom: 1px solid">RECURSOS</div>
                        <div id="recipe-${craftItem.id}"></div>
                    </div>
                `;

                const recipeContainer = card.querySelector(`#recipe-${craftItem.id}`);
                
                // Monta a receita buscando os dados de cada ingrediente no db
                craftItem.recipe.forEach(ing => {
                    const ingData = db[ing.item]; // Busca foto/nome pelo ID (ex: "ferro")
                    const row = document.createElement("div");
                    row.classList.add("recipe-row");
                    row.innerHTML = `
                        <img src="${ingData.image}">
                        <span>${ingData.name}</span>
                        <span style="color: var(--accent-green)">${ing.qty}x</span>
                    `;
                    recipeContainer.appendChild(row);
                });

                card.addEventListener("click", () => startCrafting(itemData, craftItem.recipe, db));
                itemsGrid.appendChild(card);
            });
        });

    function startCrafting(finalItem, recipe, db) {
        mainPage.classList.add("hidden");
        craftPage.classList.remove("hidden");
        
        ingredientsStage.innerHTML = "";
        resultStage.classList.add("hidden");

        recipe.forEach((ing, index) => {
            const ingData = db[ing.item];
            const img = document.createElement("img");
            img.src = ingData.image;
            img.classList.add("ingredient-anim");
            img.style.animationDelay = `${index * 0.2}s`;
            ingredientsStage.appendChild(img);
        });

        setTimeout(() => {
            document.getElementById("final-img").src = finalItem.image;
            document.getElementById("final-name").innerText = finalItem.name + " CRIADO!";
            resultStage.classList.remove("hidden");
        }, 2200);
    }

    document.getElementById("back-btn").onclick = () => {
        craftPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
    };
});