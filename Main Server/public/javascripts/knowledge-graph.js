const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
let socket = io();

function widgetInit(){
    let kgTypeInput =  document.getElementById('kg_type');
    let kgSearch = document.getElementById('kg_search');
    let kgType = kgTypeInput.value;
    let config = {
        'limit': 10,
        'languages': ['en'],
        'types': [kgType],
        'maxDescChars': 100,
        'selectHandler': selectItem,
    }
    document.getElementById('kg_type').value = '';
    KGSearchWidget(apiKey, kgSearch,config);
    changeKGWidgets(0);
}

function changeKGWidgets(option){
    // Changes the display style from searching KG or updating KG params
    let val1, val2;
    if (option == 1){
        val1 = 'block';
        val2 = 'none';
        inputAnimation('kg_type');
        widgetInit();
    } else {
        val1 = 'none';
        val2 = 'block';
        inputAnimation('kg_search');
    }
    document.getElementById('kg_type_container').style.display= val1;
    document.getElementById('set_widget_container').style.display = val1;

    document.getElementById('change_widget_container').style.display = val2;
    document.getElementById('kg_search_container').style.display = val2;
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
}

function writeKnowledgeCard(card){
    let history = document.getElementById('history');
    history.appendChild(card);
    history.scrollTop = history.scrollHeight;
}

function createCard(header, body, colour) {
    let card = document.createElement('div');
    card.className = 'card';
    card.style.position = 'unset'; // Doesn't overlap KG

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

// Add class to the btn so css animation takes effect
function inputAnimation(inputID){
    let input = document.getElementById(inputID);
    input.classList.add('inputAnimation');

    setTimeout(function (){
        input.classList.remove('inputAnimation')
    }, 5000)
}