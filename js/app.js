// Configurazione base
const DATA_URL_HOME = 'dati/prodotti.json';     // Percorso visto dalla Home
const DATA_URL_PAGE = '../dati/prodotti.json';  // Percorso visto dalla cartella 'pagine'

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SE SIAMO IN HOME PAGE (Cerco il contenitore della vetrina)
    const vetrinaContainer = document.getElementById('vetrina-dinamica');
    if (vetrinaContainer) {
        caricaVetrina(vetrinaContainer);
    }

    // 2. SE SIAMO NELLA PAGINA PRODOTTO (Cerco il contenitore del dettaglio)
    const prodottoContainer = document.getElementById('prodotto-dinamico');
    if (prodottoContainer) {
        caricaProdotto(prodottoContainer);
    }
});

// --- FUNZIONE PER LA HOME ---
function caricaVetrina(container) {
    fetch(DATA_URL_HOME)
        .then(response => response.json())
        .then(prodotti => {
            prodotti.forEach(prodotto => {
                // Genera l'HTML per ogni card
                const cardHTML = `
                    <div class="prodotto-anteprima">
                        <a href="pagine/prodotto.html?id=${prodotto.id}">
                            <img src="${prodotto.img_fronte}" alt="${prodotto.nome}">
                            <h3>${prodotto.nome}</h3>
                        </a>
                        <p>€ ${prodotto.prezzo}</p>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });
        })
        .catch(error => console.error('Errore caricamento prodotti:', error));
}

// --- FUNZIONE PER LA PAGINA DETTAGLIO ---
function caricaProdotto(container) {
    // Legge l'ID dall'URL (es. prodotto.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const idRicercato = params.get('id');

    if (!idRicercato) {
        container.innerHTML = "<h2 style='color:red'>ERRORE: NESSUN PRODOTTO SELEZIONATO</h2>";
        return;
    }

    fetch(DATA_URL_PAGE)
        .then(response => response.json())
        .then(prodotti => {
            // Trova il prodotto con quell'ID
            // Nota: il confronto '==' gestisce stringa vs numero
            const prodotto = prodotti.find(p => p.id == idRicercato);

            if (prodotto) {
                // Inietta l'HTML Trap/Cyber che abbiamo disegnato prima
                // Nota: aggiungiamo '../' alle immagini perché siamo nella sottocartella 'pagine'
                container.innerHTML = `
                    <div class="trap-gallery">
                        <div class="lato-img">
                            <span class="label-neon">FRONTE</span>
                            <img src="../${prodotto.img_fronte}" alt="Fronte">
                        </div>
                        <div class="lato-img">
                            <span class="label-neon">RETRO</span>
                            <img src="../${prodotto.img_retro}" alt="Retro">
                        </div>
                    </div>

                    <div class="trap-info">
                        <h2>${prodotto.nome}</h2>
                        <p class="desc-text">${prodotto.descrizione}</p>
                        <p class="prezzo">€ ${prodotto.prezzo}</p>
                        <button class="buy-btn">AGGIUNGI AL CARRELLO</button>
                    </div>
                `;
                
                // Aggiorna anche il titolo della pagina del browser
                document.title = `${prodotto.nome} - Dettaglio`;
            } else {
                container.innerHTML = "<h2 style='color:white'>PRODOTTO NON TROVATO. RIPROVA, PUZZONE.</h2>";
            }
        });
}