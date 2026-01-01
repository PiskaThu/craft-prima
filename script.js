document.addEventListener("DOMContentLoaded", () => {
    const itemsGrid = document.getElementById("items-grid");
    const mainPage = document.getElementById("main-page");
    const craftPage = document.getElementById("craft-page");
    const ingredientsStage = document.getElementById("ingredients-stage");
    const resultStage = document.getElementById("result-stage");
    const finalImg = document.getElementById("final-img");
    const finalName = document.getElementById("final-name");
    const backBtn = document.getElementById("back-btn");

    // 1. Carregar o JSON
    fetch('items.json')
        .then(response => response.json())
        .then(data => renderItems(data))
        .catch(err => console.error("Erro ao carregar itens:", err));

    // 2. Renderizar os itens na tela principal
    function renderItems(items) {
        items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("item-card");

            // Imagem e Nome Principal
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <div class="tooltip">
                    <strong>Receita:</strong>
                    <div id="recipe-${item.id}"></div>
                </div>
            `;

            // Preencher o Tooltip com os ingredientes
            const recipeContainer = card.querySelector(`#recipe-${item.id}`);
            item.recipe.forEach(ing => {
                const row = document.createElement("div");
                row.classList.add("recipe-row");
                // Formato: [Imagem] Nome xQuantidade
                row.innerHTML = `
                    <img src="${ing.image}">
                    <span>${ing.name} <strong>x${ing.qty}</strong></span>
                `;
                recipeContainer.appendChild(row);
            });

            // Evento de Clique para ir para a página de Craft
            card.addEventListener("click", () => startCrafting(item));

            itemsGrid.appendChild(card);
        });
    }

    // 3. Função de Animação de Craft
    function startCrafting(item) {
        // Trocar telas
        mainPage.classList.add("hidden");
        craftPage.classList.remove("hidden");
        
        // Limpar animações anteriores
        ingredientsStage.innerHTML = "";
        resultStage.classList.add("hidden");

        // Adicionar ingredientes na "Mesa de Craft"
        item.recipe.forEach((ing, index) => {
            const img = document.createElement("img");
            img.src = ing.image;
            img.style.width = "80px";
            img.style.height = "80px";
            
            // Adiciona a classe de animação com um pequeno atraso para cada um
            setTimeout(() => {
                img.classList.add("ingredient-anim");
            }, index * 200); 
            
            ingredientsStage.appendChild(img);
        });

        // Após a animação dos ingredientes (2.5s), mostrar o item final
        setTimeout(() => {
            finalImg.src = item.image;
            finalName.innerText = item.name + " Criado!";
            resultStage.classList.remove("hidden");
        }, 2500);
    }

    // 4. Botão de Voltar
    backBtn.addEventListener("click", () => {
        craftPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
        resultStage.classList.add("hidden"); // Reseta o resultado
    });
});