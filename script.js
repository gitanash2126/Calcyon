
// Load the calculators dynamically from the JSON file
document.addEventListener('DOMContentLoaded', function () {
    fetch('calculators.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.container');
            // Ensure we are adding to the correct container
            const calculatorsSection = document.querySelector('#calculators');

            // Loop through the data and create the content for each calculator
            data.forEach(calculator => {
                const box = document.createElement('div');
                box.className = 'box'; // This ensures the box element gets the same class
                box.innerHTML = `
                    <div class="content">
                        <h2>${calculator.title}</h2>
                        <h3>${calculator.description}</h3>
                        <div class="card-footer">
                            <a href="${calculator.link}" target="_blank">
                                <button>Try Now</button>
                            </a>
                            <a href="${calculator.source}" title="Source Code" target="_blank">
                                <img src="./assets/images/github.png" alt="Source Code"></img>
                            </a>
                        </div>
                    </div>
                `;
                // Append to the calculatorsSection
                calculatorsSection.appendChild(box);
            });

            // Initialize pagination and search functionality
            calculators = document.querySelectorAll('.container .box');
            h2TextContents = Array.from(calculators).map(calculator => calculator.querySelector('h2').textContent);
            showPage(currentPage);
        });

    document.getElementById('noResults').style.display = 'none';
    showPage(currentPage);
});

// Highlight active section in navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.containers');
    const navLinks = document.querySelectorAll('.nav-links');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 50) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.setAttribute('id', '');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.setAttribute('id', 'active1');
        }
    });
});

// Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en'
    },
        'google_translate_element'
    );
}

// Pagination functionality for calculators
const input = document.getElementById('calculatorSearch');
const paginationControls = document.getElementById('pagination-controls');
let calculators = document.querySelectorAll('.container .box');
let h2TextContents = [];

calculators.forEach(calculator => {
    let h2Element = calculator.querySelector('h2');
    if (h2Element) {
        h2TextContents.push(h2Element.textContent);
    }
});

// Show page based on current page number
const itemsPerPage = 10;
let currentPage = 1;

function showPage(page) {
    const boxes = document.querySelectorAll('.container .box');
    const totalPages = Math.ceil(boxes.length / itemsPerPage);
    currentPage = Math.max(1, Math.min(page, totalPages));

    boxes.forEach((box, index) => {
        box.style.display = (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) ? 'block' : 'none';
    });

    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;

    document.getElementById('prev').style.display = totalPages > 1 ? 'inline' : 'none';
    document.getElementById('next').style.display = totalPages > 1 ? 'inline' : 'none';
}

function changePage(direction) {
    showPage(currentPage + direction);
}

function scrollToSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.scrollIntoView({
        behavior: "smooth"
    });
}

// Filter calculators based on search input
function filterCalculators() {
    var input, filter, calculators, i;
    input = document.getElementById('calculatorSearch');
    filter = input.value.toUpperCase();
    calculators = document.querySelectorAll('.container .box');
    var noResults = document.getElementById('noResults');
    var paginationControls = document.getElementById('pagination-controls');
    var hasResults = false;

    for (i = 0; i < calculators.length; i++) {
        var calculator = calculators[i];
        var h2 = calculator.querySelector('h2');
        var h3 = calculator.querySelector('h3');
        var calculatorName = h2.textContent || h2.innerText;
        var calculatorDescription = h3.textContent || h3.innerText;

        if ((calculatorName.toUpperCase().indexOf(filter) > -1) || (calculatorDescription.toUpperCase().indexOf(filter) > -1)) {
            calculator.style.display = "flex";
            hasResults = true;
        } else {
            calculator.style.display = "none";
        }
    }

    if (hasResults) {
        noResults.style.display = 'none';
        paginationControls.style.display = 'none'; // Hide pagination controls during search
    } else {
        noResults.style.display = 'block';
        paginationControls.style.display = 'none'; // Hide pagination controls if no results
    }

    if (filter === "") {
        paginationControls.style.display = 'flex'; // Show pagination controls when search input is cleared
        showPage(currentPage); // Reset pagination
    }
}

var input1 = document.getElementById('calculatorSearch');
input1.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let hasResults = false;

    calculators.forEach(calculator => {
        const h2 = calculator.querySelector('h2');
        const h3 = calculator.querySelector('h3');
        const h2Text = h2 ? h2.textContent.toLowerCase() : '';
        const h3Text = h3 ? h3.textContent.toLowerCase() : '';

        if (h2Text.includes(searchTerm) || h3Text.includes(searchTerm)) {
            calculator.style.display = 'flex';
            hasResults = true;
        } else {
            calculator.style.display = 'none';
        }
    });

    // Show or hide pagination controls based on search input
    if (hasResults) {
        noResults.style.display = 'none';
        paginationControls.style.display = 'none'; // Hide pagination controls during search
    } else {
        noResults.style.display = 'block';
        paginationControls.style.display = 'none'; // Hide pagination controls if no results
    }

    if (searchTerm.length === 0) {
        paginationControls.style.display = 'flex'; // Show pagination controls when search input is cleared
        showPage(currentPage); // Reset pagination
    }
});

// Display search results in a dropdown list
let search_input_container = document.querySelector('.search-input-container');
let calculatorSearch = document.getElementById('calculatorSearch');

input.addEventListener('input', (e) => {
    let searchResultsContainer = document.getElementById('searchResults_Container') || false;
    if (searchResultsContainer) {
        search_input_container.removeChild(searchResultsContainer);
    }

    searchResultsContainer = document.createElement('div');
    let div = document.createElement('div');
    searchResultsContainer.setAttribute('id', 'searchResults_Container');

    let filtered = h2TextContents.filter(ele => {
        const searchTerm = e.target.value.toLowerCase();
        const elementText = ele.toLowerCase();
        return elementText.includes(searchTerm);
    });

    if (filtered && e.target.value.length > 0) {
        filtered.forEach((item, index) => {
            let p = document.createElement('p');
            p.textContent = item;
            p.setAttribute('key', index);
            div.appendChild(p);
            p.addEventListener('click', () => {
                calculatorSearch.value = item;
                searchResultsContainer.removeChild(div);
            });
        });
        searchResultsContainer.appendChild(div);
        search_input_container.appendChild(searchResultsContainer);
    }

    if (e.target.value.length === 0) {
        searchResultsContainer.removeChild(div);
    }
});

// Voice command feature in search bar
const searchBar = document.querySelector("#searchBar");
const searchBarInput = searchBar.querySelector("input");
const pagination = document.getElementById("pagination-controls");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    console.log("Your Browser supports speech Recognition");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;

    searchBar.insertAdjacentHTML("beforeend", '<button type="button"><i class="fas fa-microphone"></i></button>');

    const micBtn = searchBar.querySelector("button");
    const micIcon = micBtn.firstElementChild;

    micBtn.addEventListener("click", micBtnClick);

    function micBtnClick() {
        if (micIcon.classList.contains("fa-microphone")) { // Start Voice Recognition
            recognition.start(); // First time you have to allow access to mic!
        } else {
            recognition.stop();
        }
    }

    recognition.addEventListener("start", startSpeechRecognition);

    function startSpeechRecognition() {
        micIcon.classList.remove("fa-microphone");
        micIcon.classList.add("fa-microphone-slash");
        searchBarInput.focus();
        console.log("Voice activated, SPEAK");
    }

    recognition.addEventListener("end", endSpeechRecognition);

    function endSpeechRecognition() {
        micIcon.classList.remove("fa-microphone-slash");
        micIcon.classList.add("fa-microphone");
        searchBarInput.focus();
        console.log("Speech recognition service disconnected");
    }

    recognition.addEventListener("result", resultOfSpeechRecognition);

    function resultOfSpeechRecognition(event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        const newTranscript = transcript.endsWith('.') ? transcript.slice(0, -1) : transcript;
        console.log(newTranscript);
        searchBarInput.value = newTranscript;
        filterCalculators();
    }
} else {
    info.textContent = "Your Browser does not support Speech Recognition";
}
