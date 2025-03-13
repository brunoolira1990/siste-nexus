document.getElementById("product-select").addEventListener("change", function () {
    const selectedProduct = this.options[this.selectedIndex];
    const images = selectedProduct.getAttribute("data-images")
        ? JSON.parse(selectedProduct.getAttribute("data-images"))
        : null;
    const sizeButtonsContainer = document.getElementById("size-buttons-container");
    const productImage = document.getElementById("product-image");

    // Recupera o src da imagem padrão definida no HTML
    const defaultImageSrc = productImage.src;

    // Limpa os botões e oculta a imagem anterior
    sizeButtonsContainer.innerHTML = "";
    productImage.classList.remove("d-none");

    if (!this.value || !images) {
        // Se não houver valor selecionado ou se não houver imagens associadas ao produto, exibe a imagem padrão
        productImage.src = defaultImageSrc; // Imagem original definida no HTML
        return;
    }

    // Se há um produto selecionado, exibe os botões de tamanho
    if (images) {
        const sizes = Object.keys(images).sort((a, b) => {
            return convertToInches(a) - convertToInches(b);
        });

        sizes.forEach(function (size) {
            if (!images[size]) {
                console.warn(`Tamanho inválido ou sem imagem: ${size}`);
                return; // Ignora tamanhos inválidos
            }

            const button = document.createElement("button");
            button.className = "size-button";

            // Formatação do tamanho com as aspas
            const formattedSize = size.split('x').map(part => {
                return part.trim() + '"'; // Adiciona as aspas ao final de cada parte
            }).join(' x ');

            button.textContent = formattedSize; // Exibe o tamanho com as aspas
            button.setAttribute("data-size", size);
            button.setAttribute("aria-pressed", "false"); // Para acessibilidade
            sizeButtonsContainer.appendChild(button);

            // Adiciona evento de clique para alterar a imagem
            button.addEventListener("click", function () {
                // Remove 'active' de outros botões e define 'aria-pressed'
                document.querySelectorAll(".size-button").forEach(btn => {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-pressed", "false");
                });
                this.classList.add("active");
                this.setAttribute("aria-pressed", "true");

                // Atualiza a imagem
                const imageUrl = images[size] || defaultImageSrc; // Se não encontrar a imagem, usa a padrão
                productImage.src = imageUrl;
                productImage.classList.remove("d-none"); // Exibe a imagem
            });
        });
    }
});

// Função para converter tamanhos de polegada para fração decimal para comparação
function convertToInches(size) {
    const fractionMap = {
        '1/8': 0.125,
        '1/4': 0.25,
        '3/8': 0.375,
        '1/2': 0.5,
        '3/4': 0.75,
        '1': 1,
        '1.1/4': 1.25,
        '1.1/2': 1.5,
        '2': 2,
        '2.1/2': 2.5,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '8': 8,
        '10': 10,
        '12': 12,
        '14': 14,
        '16': 16,
        '18': 18,
        '20': 20,
        '22': 22,
        '24': 24
    };

    if (size.includes('x')) {
        const sizes = size.split('x').map(s => s.trim());
        let total = 0;
        sizes.forEach(part => (total += fractionMap[part] || parseFloat(part)));
        return total;
    } else {
        return fractionMap[size] || parseFloat(size);
    }
}
