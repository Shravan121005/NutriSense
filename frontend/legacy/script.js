document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("ratingForm");

    if (!form) {
        console.error("Form not found!");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const ingredientNames = document
            .getElementById("ingredientName")
            .value.trim()
            .split(",");

        const resultDiv = document.getElementById("result");

        const uniqueIngredientNames = [
            ...new Set(
                ingredientNames
                    .map(name => name.trim().toLowerCase())
                    .filter(name => name !== "")
            )
        ];

        if (uniqueIngredientNames.length === 0) {
            alert("Please enter at least one valid ingredient.");
            return;
        }

        resultDiv.innerHTML = "";
        resultDiv.classList.remove("hidden");

        const results = [];

        await Promise.all(

            uniqueIngredientNames.map(async (ingredientName) => {

                try {

                    const response = await fetch("/api/get-rating", {   // important change

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            ingredientName
                        })

                    });

                    const data = await response.json();

                    results.push({
                        ingredientName,
                        data
                    });

                } catch (error) {

                    console.error(`Error fetching ${ingredientName}`, error);

                    results.push({
                        ingredientName,
                        data: {
                            error: "Failed to fetch data."
                        }
                    });

                }

            })

        );

        let totalRating = 0;
        let ratingCount = 0;

        results.forEach(({ ingredientName, data }) => {
        
            const ingredientResult = document.createElement("div");
            ingredientResult.classList.add("ingredient-result");
        
            if (data.error) {
            
                ingredientResult.innerHTML = `
                    <h3>${ingredientName}</h3>
                    <p><strong>Error:</strong> ${data.error}</p>
                `;
            
            } else {
            
                ingredientResult.innerHTML = `
                    <h3>${data.name || ingredientName}</h3>
                    <p><strong>Description:</strong> ${data.description || "No description available"}</p>
                    <p><strong>Health Rating:</strong> ${data.health_rating ?? "N/A"}</p>
                    <p><strong>Warnings:</strong> ${data.warnings || "None"}</p>
                `;
            
                if (data.health_rating) {
                    totalRating += data.health_rating;
                    ratingCount++;
                }
            
            }
        
            resultDiv.appendChild(ingredientResult);
        
        });
        if (ratingCount > 0) {
                
            const finalRating = (totalRating / ratingCount).toFixed(2);
                
            const finalDiv = document.createElement("div");
                
            finalDiv.innerHTML = `
                <hr>
                <h2>Final Product Rating</h2>
                <h1>${finalRating} / 5</h1>
            `;
                
            finalDiv.style.textAlign = "center";
            finalDiv.style.marginTop = "20px";
                
            resultDiv.appendChild(finalDiv);
                
        }

    });

});