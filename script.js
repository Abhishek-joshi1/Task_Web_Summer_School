// FIRESTORE
var db = firebase.firestore();
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// FIRESTORE ENDED
/* Loader */
var loader = document.getElementById("loader");

// Hide the loader from DOM
function hideLoader() {
    loader.style.display = "none";
}

// Show the loader on DOM
function showLoader() {
    loader.style.display = "block";
}
/* Loader End */

var userId = localStorage.getItem("userId");
var WelcomeName = document.getElementById("welcomeName");

if (localStorage.getItem("userId") === null) {
    window.location.href = "../Login/login.html";
    alert("Please Login First");
}

/* Getting User Data */
var docRef = db.collection("Users").doc(userId);

docRef.get().then(function (doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var name = doc.data().name;
        WelcomeName.style.display = "block";
        WelcomeName.innerHTML = "Welcome :" + name.toUpperCase();
    } else {
        console.log("No such document!");
    }
}).catch(function (error) {
    console.log("Error getting document:", error);
});

function submitAd() {
    /* Get Element */
    var AdTitle = document.getElementById("adTitle").value;
    var Category = document.getElementById("Category").value;
    var AdDescription = document.getElementById("AdDescription").value;
    var Image = document.getElementById("UploadImage");
    var Name = document.getElementById("Name").value;
    var number = document.getElementById("Number").value;
    var city = document.getElementById("city").value;
    var error = document.getElementById("error");
    var price = document.getElementById("price").value;
    var buyingDate = document.getElementById("BuyingDate").value;
    var buyingPrice = document.getElementById("BuyingPrice").value;

    error.innerHTML = "Please Fill All Fields";

    /* Error On Html */
    error.innerHTML = "";

    if (AdTitle == "" || AdDescription == "" || number == "" || Category == "" || city == "" || price == "" || buyingDate == "" || buyingPrice == "") {
        error.style.display = "block";
        error.innerHTML = "Please Fill All Fields";
        return;
    }

    /* Image File Validation */
    var file = Image.files[0];
    if (!file) {
        error.style.display = "block";
        error.innerHTML = "Please upload an image.";
        return;
    }

    // Prepare image file name and path
    var imageName = Date.now() + '_' + file.name;
    var imagePath = 'images/' + imageName;

    // Upload image to storage
    var storageRef = firebase.storage().ref(imagePath);
    var uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function(snapshot) {
        // Track progress or handle state changes (optional)
    }, function(error) {
        console.error('Error uploading image:', error);
        // Handle errors
    }, function() {
        // Image uploaded successfully, now save ad data
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            var adData = {
                AdTitle: AdTitle,
                Category: Category,
                AdDescription: AdDescription,
                Name: Name,
                number: number,
                city: city,
                img: downloadURL,
                userId: userId,
                price: price,
                buyingDate: buyingDate,
                buyingPrice: buyingPrice
            };

            // Save ad data to product.js
            saveAdToProductJS(adData);

            // Optional: Show loader or success message
            showLoader();
            error.style.color = "green";
            error.style.display = "block";
            error.innerHTML = "Your Ad Has Been Posted";
            console.log("Ad data saved:", adData);

            // Redirect or perform other actions after successful submission
            setTimeout(function() {
                window.location.href = "../My account/account.html";
            }, 2000); // Redirect after 2 seconds
        });
    });
}

function saveAdToProductJS(adData) {
    // Assume product.js will have a function to append ad data to an array or object
    // Example structure in product.js:
    // var ads = []; // or var ads = {};
    // function addAd(ad) {
    //    ads.push(ad); // or ads[ad.id] = ad;
    // }
    // Add the ad data to the product.js structure
    // Example:
    // addAd(adData);
    // Adjust according to how you structure your product.js file
}

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}
