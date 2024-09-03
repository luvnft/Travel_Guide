document.getElementById('travel-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const destination = document.getElementById('destination').value;
    const dates = document.getElementById('dates').value;
    const preferences = document.getElementById('preferences').value;

    const response = await fetch('/get-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, dates, preferences })
    });

    const result = await response.json();
    document.getElementById('result').innerHTML = `
        <h2>Generated Itinerary</h2>
        <h3>Flights:</h3>
        <pre>${JSON.stringify(result.flights, null, 2)}</pre>
        <h3>Hotels:</h3>
        <pre>${JSON.stringify(result.hotels, null, 2)}</pre>
        <h3>Suggested Itinerary:</h3>
        <pre>${JSON.stringify(result.itinerary, null, 2)}</pre>
    `;
});

const animalCards = document.querySelectorAll('.animal-card');

animalCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        img.style.display = img.style.display === 'none' || img.style.display === '' ? 'block' : 'none';
    });
});
