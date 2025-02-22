const comparisonData = JSON.parse(localStorage.getItem('compareData'));
const resultsDiv = document.getElementById('comparisonResults');

if (comparisonData) {
    const { search1, search2, compareOptions } = comparisonData;
    let html = '<div class="comparison-grid">';

    compareOptions.forEach(option => {
        html += `<div class="comparison-item">
                    <h3>${option.toUpperCase()}</h3>
                    <p>${search1[option]}</p>
                    <p>${search2[option]}</p>
                </div>`;
    });

    html += '</div>';
    resultsDiv.innerHTML = html;
} else {
    resultsDiv.innerHTML = '<p>No comparison data found.</p>';
}