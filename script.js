document.addEventListener("DOMContentLoaded", () => {
    const itemsGrid = document.getElementById("items-grid");
    const mainPage = document.getElementById("main-page");
    const craftPage = document.getElementById("craft-page");
    const ingredientsStage = document.getElementById("ingredients-stage");
    const resultStage = document.getElementById("result-stage");
    const backBtn = document.getElementById("back-btn");

    fetch('items.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("item-card");
                
                card.innerHTML = `
                    <img src="${item.image}">
                    <h3>${item.name}</h3>
                    <div class="tooltip">
                        <div style="font-size: 11px; color: var(--accent-green); margin-bottom: 10px; border-bottom: 1px solid">RECURSOS</div>
                        <div id="recipe-${item.id}"></div>
                    </div>
                `;

                const recipeContainer = card.querySelector(`#recipe-${item.id}`);
                item.recipe.forEach(ing => {
                    const row = document.createElement("div");
                    row.classList.add("recipe-row");
                    row.innerHTML = `
                        <img src="${ing.image}">
                        <span>${ing.name}</span>
                        <span style="color: var(--accent-green)">${ing.qty}x</span>
                    `;
                    recipeContainer.appendChild(row);
                });

                card.addEventListener("click", () => startCrafting(item));
                itemsGrid.appendChild(card);
            });
        });

    function startCrafting(item) {
        mainPage.classList.add("hidden");
        craftPage.classList.remove("hidden");
        
        ingredientsStage.innerHTML = "";
        resultStage.classList.add("hidden");

        item.recipe.forEach((ing, index) => {
            const img = document.createElement("img");
            img.src = ing.image;
            img.classList.add("ingredient-anim");
            img.style.animationDelay = `${index * 0.2}s`;
            ingredientsStage.appendChild(img);
        });

        setTimeout(() => {
            document.getElementById("final-img").src = item.image;
            document.getElementById("final-name").innerText = item.name + " CRIADO!";
            resultStage.classList.remove("hidden");
        }, 2200);
    }

    backBtn.onclick = () => {
        craftPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
    };
});