embedcalendar();

function embedcalendar(){


const template = `
  <style>.postal-ridings{
    -webkit-box-sizing:border-box;
    -moz-box-sizing: border-box;
    box-sizing:border-box;
    position:relative;


    label{
        margin-bottom:.1rem;
        font-size:14px;
        font-size: var(--wp--custom--ui-navigation-sub-nav-heading--font-size);
    }
    label, #postal-submit{
        font-family: var(--wp--custom--ui-navigation-sub-nav-heading--font-family);
        font-weight: 700;
        font-weight: var(--wp--custom--ui-navigation-sub-nav-heading--font-weight);
        display:block;
    }
    #postal-input{
        width:100%;
        max-width:300px;
        padding:.5rem;
        font-size:16px;
        font-size: font-size: var(--wp--custom--editor--p--typography--font-size);
        border:solid 1px black;
    }

    #postal-submit{
        border-radius:0;
        background-color:black;
        color:white;
        padding:.5rem;
        border:solid 1px black;
        width:100%;
        max-width:300px;
        text-align:left;
        font-size: font-size: var(--wp--custom--editor--p--typography--font-size);
        outline:0;
        transition-duration: var(--wp--custom--transition-time);
        transition-property: filter;
        transition-timing-function: var(--wp--custom--transition-easing);
        border-top:none;

    }

    #postal-submit:hover{
        color:black;
        background-color:lightgrey;
        cursor:pointer;
    }

    #postal-riding-results{
        margin-top:1rem;
    }


    .candidate-list{
        list-style-type:none;
        padding:0;
        margin-bottom: 1.25rem;
        margin-top: .25rem;
    }

    .candidate{
        margin-bottom:.75rem;
    }

    .candidate-name{
        margin-bottom:.1rem;
    }
}
  </style>
  
  <div class="postal-ridings">
        <h5>Who's running in your riding?</h5>
        <form id="postal-lookup-form">
            <label for="postal-input">Postal code</label>
            <input type="text" id="postal-input" name="postalCode" placeholder="H3A 1V4" 
  autocomplete="postal-code"required>
        <button type="submit" id="postal-submit">Submit &rarr;</button>
        </form>
        <div id="postal-riding-results">
            
        </div>
    </div>

  <script>
  const fsaCache = {};
let candidatesLookup = null;
let postalLookupInitialized = false;

const postalRegex =
    /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

async function getCandidatesLookup() {

    if (!candidatesLookup) {

        const response = await fetch(
            "https://dr-mtl.github.io/elxn_2026/candidates.json"
        );

        candidatesLookup = await response.json();

    }

    return candidatesLookup;

}

async function getRidings(postalCode) {

    postalCode = postalCode
        .toUpperCase()
        .replace(/\s+/g, "");

    const fsa = postalCode.substring(0, 3);

    if (!fsaCache[fsa]) {

        try {

            const url = "https://dr-mtl.github.io/elxn_2026/postal/" + fsa + ".json";
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("FSA_NOT_FOUND");
            }

            fsaCache[fsa] = await response.json();

        } catch (error) {

            throw new Error("POSTAL_CODE_NOT_FOUND");

        }

    }

    return fsaCache[fsa][postalCode] || [];

}

async function lookupPostalCode(postalCode) {

    const ridings = await getRidings(postalCode);

    if (!ridings.length) {
        return [];
    }

    const candidates = await getCandidatesLookup();

    return ridings.map(riding => ({
        riding,
        candidates: candidates[riding] || []
    }));

}

function partyToClass(party) {

    return party
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}

async function runPostalLookup() {

    const resultsContainer =
        document.getElementById("postal-riding-results");

    const postalInput =
        document.getElementById("postal-input");

    if (!resultsContainer || !postalInput) {
        return;
    }

    resultsContainer.innerHTML = "";

    const postalCode = postalInput.value.trim();

    if (!postalRegex.test(postalCode)) {

        resultsContainer.innerHTML =
            '<p>This is not a Quebec postal code.</p>';

        return;

    }

    try {

        const results = await lookupPostalCode(postalCode);

        if (results.length === 0) {

            resultsContainer.innerHTML =
                '<p>This is not a Quebec postal code.</p>';

            return;

        }

        let html = "";

        if (results.length > 1) {

            const ridingNames =
                results.map(result => result.riding);

            html += '<p>' +'There are ' + results.length + ' ridings in this postal code: ' + ridingNames.join(' and ') + '.</p>';

        }

        results.forEach(function (result) {

            html += '<h5>'+ result.riding +'</h5>';
            html += '<ul class="candidate-list">';

            result.candidates.forEach(function (candidate) {

                const partyClass =
                    partyToClass(candidate.Party || "");

                html += '<li class="candidate ' + partyClass + '">' +    '<p class="candidate-name">' + (candidate.Name || '') + '</p>' + '<div class="riding-name">' +    (candidate.Party || '') + '</div>' + '</li>';

            });

            html += '</ul>';

        });

        resultsContainer.innerHTML = html;

    } catch (error) {

        resultsContainer.innerHTML =
            '<p>This is not a Quebec postal code.</p>';

        console.error(error);

    }

}

function initializePostalLookup() {

    if (postalLookupInitialized) {
        return;
    }

    postalLookupInitialized = true;

    document.addEventListener("click", function (event) {

        if (event.target.id === "postal-submit") {

            event.preventDefault();
            runPostalLookup();

        }

    });

    document.addEventListener("keydown", function (event) {

        if (
            event.target.id === "postal-input" &&
            event.key === "Enter"
        ) {

            event.preventDefault();
            runPostalLookup();

        }

    });

    document.addEventListener("input", function (event) {

        if (event.target.id === "postal-input") {

            event.target.value =
                event.target.value.toUpperCase();

        }

    });

}

initializePostalLookup();
`;

const targetDiv = document.getElementById('postal-ridings-ballot');

const contextualFragment = document.createRange().createContextualFragment(template);

targetDiv.innerHTML = ''; 
targetDiv.appendChild(contextualFragment);
};
