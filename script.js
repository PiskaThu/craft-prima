document.addEventListener("DOMContentLoaded", () => {
    const itemsGrid = document.getElementById("items-grid");
    const mainPage = document.getElementById("main-page");
    const craftPage = document.getElementById("craft-page");
    const ingredientsStage = document.getElementById("ingredients-stage");
    const resultStage = document.getElementById("result-stage");
    const backBtn = document.getElementById("back-btn");

    // 1. Carrega o JSON
    fetch('items.json')
        .then(res => res.json())
        .then(data => {
            const db = data.database;

            data.craftables.forEach(craftItem => {
                const itemData = db[craftItem.id];
                if (!itemData) return;

                const card = document.createElement("div");
                card.classList.add("item-card");
                
                card.innerHTML = `
                    <img src="${itemData.image}" alt="${itemData.name}">
                    <h3>${itemData.name}</h3>
                    <div class="tooltip">
                        <div style="font-size: 10px; color: var(--accent-green); margin-bottom: 12px; border-bottom: 1px solid #30363d; padding-bottom: 5px; text-transform: uppercase; font-weight: bold;">Componentes Requeridos</div>
                        <div id="recipe-${craftItem.id}"></div>
                    </div>
                `;

                // Monta a lista de componentes no Tooltip
                const recipeContainer = card.querySelector(`#recipe-${craftItem.id}`);
                craftItem.recipe.forEach(ing => {
                    const ingData = db[ing.item];
                    if (ingData) {
                        const row = document.createElement("div");
                        row.classList.add("recipe-row");
                        row.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <img src="${ingData.image}" style="width: 24px; height: 24px; object-fit: contain;">
                                <span style="font-size: 13px;">${ingData.name}</span>
                            </div>
                            <span style="color: var(--accent-green); font-weight: bold;">${ing.qty}x</span>
                        `;
                        recipeContainer.appendChild(row);
                    }
                });

                // Clique para fabricar
                card.addEventListener("click", () => startCrafting(itemData, craftItem.recipe, db));
                itemsGrid.appendChild(card);
            });
        });

    // 2. Lógica da Animação
    function startCrafting(finalItem, recipe, db) {
        mainPage.classList.add("hidden");
        craftPage.classList.remove("hidden");
        
        ingredientsStage.innerHTML = "";
        resultStage.classList.add("hidden");

        // Cria os ingredientes "voando" para o centro
        recipe.forEach((ing, index) => {
            const ingData = db[ing.item];
            const img = document.createElement("img");
            img.src = ingData.image;
            img.classList.add("ingredient-anim");
            img.style.animationDelay = `${index * 0.2}s`;
            ingredientsStage.appendChild(img);
        });

        // Mostra o resultado final após a fusão
        setTimeout(() => {
            const finalImg = document.getElementById("final-img");
            const finalName = document.getElementById("final-name");
            
            finalImg.src = finalItem.image;
            finalName.innerHTML = `<span style="color: var(--text-dim); font-size: 14px;">ITEM OBTIDO</span><br>${finalItem.name.toUpperCase()}`;
            
            resultStage.classList.remove("hidden");
        }, 2200);
    }

    // 3. Botão de Voltar
    backBtn.onclick = () => {
        craftPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
        // Limpa o palco para a próxima vez
        resultStage.classList.add("hidden");
    };
});