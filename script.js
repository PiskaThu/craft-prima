document.addEventListener("DOMContentLoaded", () => {
    const mainPage = document.getElementById("main-page");
    const craftPage = document.getElementById("craft-page");
    const ingredientsStage = document.getElementById("ingredients-stage");
    const resultStage = document.getElementById("result-stage");
    const backBtn = document.getElementById("back-btn");

    fetch('items.json')
        .then(res => res.json())
        .then(data => {
            const db = data.database;

            data.craftables.forEach(craftItem => {
                const itemData = db[craftItem.id];
                if (!itemData) return;

                const finalQty = craftItem.resultQty || 1;
                const card = document.createElement("div");
                card.classList.add("item-card");
                
                card.innerHTML = `
                    <img src="${itemData.image}">
                    <h3>${itemData.name} ${finalQty > 1 ? 'x'+finalQty : ''}</h3>
                    <div class="tooltip">
                        <div style="font-size: 10px; color: var(--accent-green); margin-bottom: 12px; border-bottom: 1px solid #30363d; padding-bottom: 5px; text-transform: uppercase; font-weight: bold;">Componentes</div>
                        <div id="recipe-${craftItem.id}"></div>
                    </div>
                `;

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

                card.addEventListener("click", () => startCrafting(itemData, craftItem.recipe, db, finalQty));

                // Lógica de separação por categoria
                if (craftItem.category === "secondary") {
                    document.getElementById("items-grid-secondary").appendChild(card);
                } else {
                    document.getElementById("items-grid-primary").appendChild(card);
                }
            });
        });

    function startCrafting(finalItem, recipe, db, finalQty) {
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
            document.getElementById("final-name").innerHTML = `
                <span style="color: var(--text-dim); font-size: 14px;">PRODUÇÃO CONCLUÍDA</span><br>
                ${finalQty}x ${finalItem.name.toUpperCase()}
            `;
            resultStage.classList.remove("hidden");
        }, 2200);
    }

    backBtn.onclick = () => {
        craftPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
    };
});