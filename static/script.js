const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".img-slide");
const contents = document.querySelectorAll(".content");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active"); 
});

var sliderNov = function(manual){
    btns.forEach((btn) =>{
        btn.classList.remove("active");
    });

    slides.forEach((slide) =>{
        slide.classList.remove("active");
    });

    contents.forEach((content) =>{
        content.classList.remove("active");
    });

    btns[manual].classList.add("active");
    slides[manual].classList.add("active");
    contents[manual].classList.add("active");
}

btns.forEach((btn, i) => {
    btn.addEventListener("click", () =>{
        sliderNov(i);
    });
});


var currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    contents.forEach((content) => {
        content.classList.remove("active");
    });

    btns.forEach((btn) => {
        btn.classList.remove("active");
    });

    slides[index].classList.add("active");
    contents[index].classList.add("active");
    btns[index].classList.add("active");
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Start autosliding
var slideInterval = setInterval(nextSlide, 15000); // Change slide every 15 seconds

// Pause autosliding when mouse is over the slider
slides.forEach((slide) => {
    slide.addEventListener("mouseenter", () => {
        clearInterval(slideInterval);
    });

    slide.addEventListener("mouseleave", () => {
        slideInterval = setInterval(nextSlide, 15000);
    });
});

const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");

const UNSPLASH_API_KEY = "wi8uOCh7-KOFX2f6xGwM1vOOgJNxpt6k9Y2DDcim0fI";  // Replace with your Unsplash API key

async function generateRelatedImages(userPrompt, userImageQuantity) {
    function updateImageCard(imgUrls) {
        imgUrls.forEach((imgUrl, index) => {
            const imgCard = ImageGallery.querySelectorAll(".img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadBtn = imgCard.querySelector(".download-btn");

            console.log(`Generated Image URL: ${imgUrl}`); // Debugging

            imgElement.src = imgUrl;

            imgElement.onload = () => {
                imgCard.classList.remove("loading");
                downloadBtn.setAttribute("href", imgUrl);
                downloadBtn.setAttribute("download", `${userPrompt}-${index + 1}.jpg`);
            };

            imgElement.onerror = () => {
                imgCard.classList.remove("loading");
                imgElement.src = "static/error-placeholder.png"; // Fallback image
                console.error(`Failed to load image: ${imgUrl}`);
            };
        });
    }

    try {
        // Fetch images from Unsplash based on the userPrompt
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${userPrompt}&count=${userImageQuantity}&client_id=${UNSPLASH_API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();
        const imgUrls = data.map(item => item.urls.regular); // Get the regular-sized image URLs

        updateImageCard(imgUrls);
    } catch (error) {
        alert("Pls Check Your Internet Connection");
        console.error(error);
    }
}

generateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userPrompt = event.target[0].value;
    const userImageQuantity = parseInt(event.target[1].value);

    const imgCardMarkup = Array.from({ length: userImageQuantity }, () => {
        return `
            <div class="img-card loading">
                <img src="static/loader.svg" alt="loading">
                <a href="#" class="download-btn">
                    <img src="static/download.svg" alt="download-icon">
                </a>
            </div>
        `;
    }).join("");

    ImageGallery.innerHTML = imgCardMarkup;
    generateRelatedImages(userPrompt, userImageQuantity);
});



