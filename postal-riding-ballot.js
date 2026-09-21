(function(){
const container=document.getElementById('postal-ridings-ballot');
if(!container){
console.error('postal-ridings-ballot container not found');
return;
}
container.innerHTML="<div class=\"postal-ridings\">\n        <h5>Who's running in your riding?</h5>\n        <form id=\"postal-lookup-form\">\n            <label for=\"postal-input\">Postal code</label>\n            <input type=\"text\" id=\"postal-input\" name=\"postalCode\" placeholder=\"H3A 1V4\" \n  autocomplete=\"postal-code\"required>\n        <button type=\"submit\" id=\"postal-submit\">Submit &rarr;</button>\n        </form>\n        <div id=\"postal-riding-results\">\n            \n        </div>\n    </div>";
if(!document.getElementById('postal-ridings-ballot-styles')){
const style=document.createElement('style');
style.id='postal-ridings-ballot-styles';
style.textContent=".postal-ridings{\n\t-webkit-box-sizing:border-box;\n    -moz-box-sizing: border-box;\n    box-sizing:border-box;\n    position:relative;\n\n\n    label{\n    \tmargin-bottom:.1rem;\n    \tfont-size:14px;\n  \t\tfont-size: var(--wp--custom--ui-navigation-sub-nav-heading--font-size);\n    }\n    label, #postal-submit{\n    \tfont-family: var(--wp--custom--ui-navigation-sub-nav-heading--font-family);\n  \t\tfont-weight: 700;\n  \t\tfont-weight: var(--wp--custom--ui-navigation-sub-nav-heading--font-weight);\n    \tdisplay:block;\n    }\n    #postal-input{\n    \twidth:100%;\n    \tmax-width:300px;\n    \tpadding:.5rem;\n    \tfont-size:16px;\n    \tfont-size: font-size: var(--wp--custom--editor--p--typography--font-size);\n    \tborder:solid 1px black;\n    }\n\n    #postal-submit{\n    \tborder-radius:0;\n    \tbackground-color:black;\n    \tcolor:white;\n    \tpadding:.5rem;\n    \tborder:solid 1px black;\n    \twidth:100%;\n    \tmax-width:300px;\n    \ttext-align:left;\n    \tfont-size: font-size: var(--wp--custom--editor--p--typography--font-size);\n    \toutline:0;\n    \ttransition-duration: var(--wp--custom--transition-time);\n  \t\ttransition-property: filter;\n  \t\ttransition-timing-function: var(--wp--custom--transition-easing);\n  \t\tborder-top:none;\n\n    }\n\n    #postal-submit:hover{\n    \tcolor:black;\n    \tbackground-color:lightgrey;\n    \tcursor:pointer;\n    }\n\n    #postal-riding-results{\n    \tmargin-top:1rem;\n    }\n\n\n    .candidate-list{\n    \tlist-style-type:none;\n    \tpadding:0;\n    }\n\n    .candidate{\n    \tmargin-bottom:.75rem;\n    }\n\n    .candidate-name{\n    \tmargin-bottom:.1rem;\n    }\n}";
document.head.appendChild(style);
}
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
const response = await fetch(
`https://dr-mtl.github.io/elxn_2026/postal/${fsa}.json`
);
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
"<p>This is not a valid postal code.</p>";
return;
}
try {
const results = await lookupPostalCode(postalCode);
if (results.length === 0) {
resultsContainer.innerHTML =
"<p>This is not a Quebec postal code.</p>";
return;
}
let html = "";
if (results.length > 1) {
const ridingNames =
results.map(result => result.riding);
html += `
<p>
There are ${results.length} ridings in this postal code:
${ridingNames.join(" and ")}.
</p>
`;
}
results.forEach(function (result) {
html += `<h5>${result.riding}</h5>`;
html += `<ul class="candidate-list">`;
result.candidates.forEach(function (candidate) {
const partyClass =
partyToClass(candidate.Party || "");
html += `
<li class="candidate ${partyClass}">
<p class="candidate-name">
${candidate.Name || ""}
</p>
<div class="riding-name">
${candidate.Party || ""}
</div>
</li>
`;
});
html += `</ul>`;
});
resultsContainer.innerHTML = html;
} catch (error) {
resultsContainer.innerHTML =
"<p>This is not a Quebec postal code.</p>";
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
})();
