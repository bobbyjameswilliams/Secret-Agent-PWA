const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
let socket = io();

function widgetInit(){
    let type= document.getElementById("kg_type").value;
    let config = {
        'limit': 10,
        'languages': ['en'],
        'types': [type],
        'maxDescChars': 100,
        'selectHandler': selectItem,
    }
    KGSearchWidget(apiKey, document.getElementById("kg_search"), config);
    document.getElementById("kg_type").value = '';
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem(event){
    let row = event.row;
    let c = canvasColour;
    sendKnowledgeSnippet(row.name, row.rc, c);

    document.getElementById("kg_search").value = '';
    /**
    document.getElementById('resultId').innerText= 'id: '+row.id;
    document.getElementById('resultName').innerText= row.name;
    document.getElementById('resultDescription').innerText= row.rc;
    document.getElementById("resultUrl").href= row.qc;
    document.getElementById('resultPanel').style.display= 'block';
     */
}

function writeKnowledgeCard(card){
    let history = document.getElementById('history');
    history.appendChild(card);
    history.scrollTop = history.scrollHeight;
}

function createCard(header, body, colour) {
    let card = document.createElement('div');
    card.className = 'card';

    //let img = document.createElement('img');
    //img.className = 'card-img-top';
    //img.src = row.json.image.url;

    let cardHeader = document.createElement('h3');
    cardHeader.className = 'card-header';
    cardHeader.innerHTML = header;
    cardHeader.style.backgroundColor = colour;

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.innerHTML = body;

    card.appendChild(cardHeader)
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);

    return card
}