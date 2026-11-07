console.log("JS file is working!");
console.log('User input element:', document.getElementById('user-input'));
console.log('Send button element:', document.getElementById('send-button'));
console.log('AI response element:', document.getElementById('ai-response'));

// POPUP ELEMENTS
const pins = document.querySelectorAll("map-pin");
const popup = document.getElementById("mapPopup");
const popupImg = document.getElementById("popupImg");
const popupTitle = document.getElementById("popupTitle");
const popupDesc = document.getElementById("popupDesc");



pins.forEach(pin => {
  pin.addEventListener("mouseenter", (e) => {
    alert("hello");
    popupImg.src = pin.dataset.image;
    popupTitle.textContent = pin.dataset.title;
    popupDesc.textContent = pin.dataset.desc || "";

    popup.style.display = "block";
    popup.style.top = (e.pageY - 70) + "px";
    popup.style.left = (e.pageX + 20) + "px";
  });

  pin.addEventListener("mouseleave", () => {
    popup.style.display = "none";
  });
});


// DIRECTORY — CLEAN & FIXED
document.querySelectorAll('.building-content details').forEach(d => {
  d.open = false;
});

document.querySelectorAll('.building-card').forEach(card => {
  const header = card.querySelector('.building-header');

  header.addEventListener('click', () => {
    const isOpen = card.classList.contains('active');

    // Close all other cards
    document.querySelectorAll('.building-card.active').forEach(openCard => {
      if (openCard !== card) {
        openCard.classList.remove('active');
      }
    });

    // Toggle this one
    card.classList.toggle('active', !isOpen);
  });
});



// NAVBAR GLASS EFFECT
document.addEventListener('DOMContentLoaded', () => {
  const topNav = document.querySelector('.top-nav');
  if (!topNav) return;

  const handleScroll = () => {
    topNav.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // set the correct state on page load
});


// MOBILE NAV TOGGLE
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


// CONTACT FORM
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const response = await fetch("https://formspree.io/f/mwpygpbd", {
    method: "POST",
    body: data,
    headers: { "Accept": "application/json" }
  });

  if (response.ok) {
    status.style.display = "block";
    form.reset();
  } else {
    status.style.display = "block";
    status.style.color = "red";
    status.textContent = "Oops! Something went wrong. Try again.";
  }
});


//AI SECTION

// --- Step 2.1: Get references to our HTML elements ---
const userInput = document.getElementById('user-input'); // The text box where the user types
const sendButton = document.getElementById('send-button'); // The 'Send' button
const aiResponseDiv = document.getElementById('ai-response'); // The area where AI's answer appears

// --- Step 2.2: Define our AI's knowledge base (keywords and answers) ---
// This is like a dictionary where each "word" has a "definition"
const aiKnowledge = {
    "restroom": "The nearest restroom is on the ground floor of Building A, near the main entrance.",
    "comfort room": "The nearest comfort room is on the ground floor of Building A, near the main entrance.", // Add synonyms
    "canteen": "The university canteen is located on the second floor of the Main Building.",
    "cafeteria": "The university cafeteria is located on the second floor of the Main Building.",
    "library": "The PLMun Library is on the 3rd floor of the Academic Building. It's open from 8 AM to 5 PM.",
    "dean": "The Dean's office for the College of Arts and Sciences is in Building C. Please check the directory for specific office hours.",
    "clinic": "The university clinic is located beside the guard house at the main gate. It operates during school hours.",
    "guard": "The main guard house is at the university's entrance.",
    "registrar": "The Registrar's office is located on the ground floor of the Administration Building.",
    "enrollment": "For enrollment inquiries, please visit the Registrar's office on the ground floor of the Administration Building.",
    "admission": "For admission inquiries, please visit the Admissions Office, usually located near the Registrar.",
    "security": "For security concerns, please approach any university guard or visit the main guard house.",
    "help": "How can I help you today? You can ask about locations like the library, canteen, or restrooms."
    // You will add more keywords and answers here as your project grows!
};

// --- Step 2.3: Create a function that processes the user's question ---
function processUserQuestion() {
    // Get what the user typed, and convert it to lowercase
    // (e.g., "Restroom" becomes "restroom" so our matching works)
    const userQuery = userInput.value.toLowerCase();

    let response = "I'm sorry, I couldn't find information for that. Please try rephrasing your query or ask about a specific location like 'library' or 'canteen'."; // Default answer if no keyword is found

    // Loop through all the keywords in our 'aiKnowledge'
    for (const keyword in aiKnowledge) {
        // Check if the user's question contains our current keyword
        if (userQuery.includes(keyword)) {
            response = aiKnowledge[keyword]; // If it does, use the answer associated with that keyword
            break; // Stop looking after we find the first match
        }
    }

    // --- Step 2.4: Display the AI's response ---
    aiResponseDiv.textContent = response; // Put the response into the designated div on the webpage
    userInput.value = ''; // Clear the input box after sending
}

// --- Step 2.5: Make the button clickable ---
// When the 'Send' button is clicked, run our 'processUserQuestion' function
sendButton.addEventListener('click', processUserQuestion);

// --- Optional: Allow pressing Enter to send the question ---
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        processUserQuestion();
    }
});

// === OFFICE DIRECTORY: BUILDING CLICK FUNCTION ===

const buildingCards = document.querySelectorAll('.building-card');
const officeDirectory = document.querySelector('.office-directory');

buildingCards.forEach(card => {
    const header = card.querySelector('.building-header');

    if (!header) return;

    header.addEventListener('click', () => {
        const isAlreadyOpen = card.classList.contains('active');

        // Close all building cards first
        buildingCards.forEach(otherCard => {
            otherCard.classList.remove('active');
        });

        // Open the selected card if it wasn't already open
        if (!isAlreadyOpen) {
            card.classList.add('active');
        }

        // Adjust directory space for the open dropdown
        if (officeDirectory) {
            officeDirectory.classList.toggle(
                'has-open-building',
                document.querySelector('.building-card.active') !== null
            );
        }
    });
});