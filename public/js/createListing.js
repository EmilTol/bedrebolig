document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

   form.addEventListener("submit", async (event) => {
       event.preventDefault();

       //ALLE VORES MANGE MANGE VÆRDEIER
       const title = document.getElementById("title").value;
       const description = document.getElementById("description").value;
       const buildingType = document.getElementById("buildingType").value;
       const buildYear = parseInt(document.getElementById("buildYear").value);
       const squareMeters = parseInt(document.getElementById("squareMeters").value);

       const city = document.getElementById("city").value;
       const postalCode = parseInt(document.getElementById("postalCode").value);
       const address = document.getElementById("adress").value;

       // Koordinater: bruger "lng, lat" i ét input → split
       const coordinateInput = document.getElementById("coordinates").value;
       const [lng, lat] = coordinateInput.split(",").map(Number);

       const rooms = parseInt(document.getElementById("rooms").value);
       const lotSize = parseInt(document.getElementById("lotSize").value);
       const basementSize = parseInt(document.getElementById("basementSize").value);
       const renovationYear = parseInt(document.getElementById("renovationYear").value);
       const floors = parseInt(document.getElementById("floors").value);
       const apartmentFloor = document.getElementById("apartmentFloor").value;
       const energyRating = document.getElementById("energyRating").value;


       const evaluation = document.getElementById("evaluation").value || null;

       const purchasePrice = parseInt(document.getElementById("purchasePrice").value);
       const monthlyOwnershipCost = parseInt(document.getElementById("monthlyOwnershipCost").value);
       const downPayment = parseInt(document.getElementById("downPayment").value);
       const brutto = parseInt(document.getElementById("brutto").value);
       const netto = parseInt(document.getElementById("netto").value);

       //samler alle de forskellige priser under price
       const price = {
           purchasePrice,
           monthlyOwnershipCost,
           downPayment,
           brutto,
           netto
       };
        //samme med location
       const location = {
           city,
           postalCode,
           address,
           coordinates: {
               type: "Point",
               coordinates: [lng, lat]
           }
       };

       //sætter dem her, fylder ikke lige så meget
       const data = {
           title,
           description,
           buildingType,
           buildYear,
           squareMeters,
           rooms,
           lotSize,
           basementSize,
           renovationYear,
           floors,
           apartmentFloor,
           energyRating,
           evaluation,
           price,
           location
       };

       try {
           const token = localStorage.getItem("token");
           if (!token) {
               alert("Du er ikke logget ind!");
               window.location.href = "/login.html";
               return;
           }

           const response = await fetch("/api/listing", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json",
                   "Authorization": "Bearer " + token
               },
               body: JSON.stringify(data)
           });


           const result = await response.json();

           if(!response.ok) {
               alert("Fejl: " + result.error);
               return;
           }
           alert("Dit bolig opslag er sendt til godkendelse")
           console.log("Listing created!! :D", result);
       } catch (error) {
           console.error("Error creating listing", error);
           alert("Noget gik galt")

       }

   })
});

//DUMME DROPDOWN DER IKKE FUNGERE
async function loadDropdowns() {
    const response = await fetch("/api/enums");
    const enums = await response.json();

    const buildingTypeSelect = document.getElementById("buildingType");
    const energyRatingSelect = document.getElementById("energyRating");

    enums.buildingType.forEach(value => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        buildingTypeSelect.appendChild(opt);
    });
    enums.energyRating.forEach(value => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        energyRatingSelect.appendChild(opt);
    });
}
loadDropdowns();