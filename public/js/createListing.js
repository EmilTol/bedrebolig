document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

   form.addEventListener("submit", async (event) => {
       event.preventDefault();

       //Skal bruge formdata da vi arbejder med tekst og billeder (filer)
       const formData = new FormData();

       //ALLE VORES MANGE MANGE VÆRDEIER
       formData.append("title",document.getElementById("title").value);
       formData.append("description",document.getElementById("description").value);
       formData.append("buildingType",document.getElementById("buildingType").value);
       formData.append("buildYear",parseInt(document.getElementById("buildYear").value));
       formData.append("squareMeters", parseInt(document.getElementById("squareMeters").value));

       const city = document.getElementById("city").value;
       const postalCode = parseInt(document.getElementById("postalCode").value);
       const address = document.getElementById("adress").value;

       //
       // //samler city osv sammen i location (check models hvis forvirret)
       formData.append("location[city]", city);
       formData.append("location[postalCode]", postalCode);
       formData.append("location[address]", address);

       formData.append("rooms", parseInt(document.getElementById("rooms").value));

       // Optional number fields - only append if they have a value
       const lotSize = document.getElementById("lotSize").value;
       if (lotSize && lotSize.trim() !== "") {
           formData.append("lotSize", parseInt(lotSize));
       }

       const basementSize = document.getElementById("basementSize").value;
       if (basementSize && basementSize.trim() !== "") {
           formData.append("basementSize", parseInt(basementSize));
       }

       const renovationYear = document.getElementById("renovationYear").value;
       if (renovationYear && renovationYear.trim() !== "") {
           formData.append("renovationYear", parseInt(renovationYear));
       }

       formData.append("floors", parseInt(document.getElementById("floors").value));

       const apartmentFloor = document.getElementById("apartmentFloor").value;
       if (apartmentFloor && apartmentFloor.trim() !== "") {
           formData.append("apartmentFloor", apartmentFloor);
       }

       formData.append("energyRating", document.getElementById("energyRating").value);


       const evaluation = document.getElementById("evaluation").value || null;

       formData.append("price[purchasePrice]", parseInt(document.getElementById("purchasePrice").value));
       formData.append("price[monthlyOwnershipCost]", parseInt(document.getElementById("monthlyOwnershipCost").value));
       formData.append("price[downPayment]", parseInt(document.getElementById("downPayment").value));
       formData.append("price[brutto]", parseInt(document.getElementById("brutto").value));
       formData.append("price[netto]", parseInt(document.getElementById("netto").value));

       const images = document.getElementById("images").files;
       for (let i = 0; i < images.length; i++) {
           formData.append("images", images[i]);
       }

       try {
           const token = sessionStorage.getItem("token");
           if (!token) {
               alert("Du er ikke logget ind!");
               window.location.href = "/login.html";
               return;
           }

           const response = await fetch("/api/listing", {
               method: "POST",
               headers: {
                   //bruger ikke content type med formData
                   "Authorization": "Bearer " + token
               },
               body: formData
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

// Navigation - tjek om bruger er logget ind (påkrævet for at oprette bolig)
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user') || '{}');

// Redirect hvis IKKE logget ind
if (!token) {
    alert('Du skal være logget ind for at oprette en bolig');
    window.location.href = '/html/login.html';
}

// Redirect hvis IKKE admin eller realtor
if (user.role !== 'admin' && user.role !== 'realtor') {
    alert('Kun administratorer og ejendomsmæglere kan oprette boliger');
    window.location.href = '/';
}

const userMenu = document.getElementById('userMenuCreate');
if (token && user) {
    // Bruger er logget ind - vis kun profil og log ud (ikke "opret bolig" da vi allerede er her)
    userMenu.innerHTML = `
        <a href="/html/profile.html">Profil</a>
        <button id="logoutBtn">Log ud</button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });
}