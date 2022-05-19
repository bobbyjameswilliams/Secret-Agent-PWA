////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

//var idb = require('../idb/index.js');

class Article{
    title;
    image;
    description;
    author_name;
    date_of_issue;

    constructor(title, image, description, author_name, date_of_issue) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.author_name = author_name;
        this.date_of_issue = date_of_issue;
    }
}

let db

// Databases
const APP_DB_NAME = 'db_app_1';
// Stores
const ARTICLES_STORE_NAME= 'store_articles';
const QUEUED_ARTICLES_STORE_NAME= 'store_queued_articles'
const IMAGE_ANNOTATIONS_STORE_NAME= 'store_image_annotations';
const CHAT_MESSAGES_STORE_NAME= 'store_chat_messages';


/**
 * Initialises all database stores.
 * @todo Create other stores in this when needed.
 * @returns {Promise<void>}
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(APP_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                //Creating articles store
                if (!upgradeDb.objectStoreNames.contains(ARTICLES_STORE_NAME)) {
                    let appIDB1 = upgradeDb.createObjectStore(ARTICLES_STORE_NAME, {
                        keyPath: '_id',
                        autoIncrement: true
                    });
                    appIDB1.createIndex('article', '_id', {unique: false, multiEntry: true});
                }
                //Creating articles to be synced store
                if (!upgradeDb.objectStoreNames.contains(QUEUED_ARTICLES_STORE_NAME)) {
                    let appIDB1 = upgradeDb.createObjectStore(QUEUED_ARTICLES_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    appIDB1.createIndex('queued_article', 'id', {unique: true, multiEntry: true});
                }
                //Creating image annotations store
                if (!upgradeDb.objectStoreNames.contains(IMAGE_ANNOTATIONS_STORE_NAME)) {
                    let articleDB = upgradeDb.createObjectStore(IMAGE_ANNOTATIONS_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    articleDB.createIndex('canvas', 'roomNo', {unique: false, multiEntry: true});
                }
                //Creating Comments Store
                if (!upgradeDb.objectStoreNames.contains(CHAT_MESSAGES_STORE_NAME)) {
                    let commentDB = upgradeDb.createObjectStore(CHAT_MESSAGES_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    commentDB.createIndex('chats', 'roomNo', {unique: false, multiEntry: true});
                }
            }
        });
    }
}
window.initDatabase= initDatabase;

/**
 * Flushes queue to Mongo, retrieves articles back and stores in articles idb store.
 * @returns {Promise<void>}
 */
export async function syncArticles(){
    await flushQueuedArticles();
    let mongoArticles = await getArticlesMongo()
    await storeArticles(mongoArticles)
}


/**
 * Stores single article in articles idb store.
 * @returns {Promise<void>}
 */
export async function flushQueuedArticles(){
    if(!db){
        await initDatabase();
    } if (db) {
        try {
            let tx = await db.transaction(QUEUED_ARTICLES_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(QUEUED_ARTICLES_STORE_NAME);
            let keys = await store.getAllKeys();
            for (const key of keys) {
                let article = await retreiveQueuedArticle(key)
                let insert = await insertArticleMongo(article)
                if (insert){
                    await deleteQueuedArticle(key)
                } else {
                    throw Error()
                }
            }
        } catch (e) {
            throw e;
        }
    }
}

/**
 * Stores article in articles IDB store.
 * @param article Article to store
 * @returns {Promise<void>}
 */
export async function storeArticle(article){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(ARTICLES_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(ARTICLES_STORE_NAME);
            await store.put(article);
            await tx.complete;
            console.log('added item to the store! ' + JSON.stringify(article));
        } catch (error) {
            console.log("Error in storeArticle()")
        }
    }
}

/**
 * Stores collection of articles iteratively in articles idb store.
 * @param articles
 * @returns {Promise<void>}
 */
export async function storeArticles(articles){
    articles.forEach(element => storeArticle(element))
}

/**
 * Stores single article in the article sync queue.
 * @param article
 * @returns {Promise<void>}
 */
export async function storeQueuedArticle(article){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(QUEUED_ARTICLES_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(QUEUED_ARTICLES_STORE_NAME);
            await store.put(article);
            await tx.complete;
            console.log('added item to the store! ' + JSON.stringify(article));
        } catch (error) {
            console.log("Error in storeQueuedArticle()")
        }
    }
}

/**
 * Stores comment object in IDB.
 * @param commentObject Comment object.
 * @returns {Promise<void>}
 */
export async function storeComment(commentObject) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(CHAT_MESSAGES_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_MESSAGES_STORE_NAME);
            await store.put(commentObject);
            await tx.complete;
            console.log('added item to the store! ' + JSON.stringify(commentObject));
        } catch (error) {
            console.log("Error in storeComment()")
        }
    }
}

/**
 * Stores annotation object in IDB.
 * @param canvasObject Canvas object constaining annotation data.
 * @returns {Promise<void>}
 */
export async function storeAnnotation(canvasObject) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(IMAGE_ANNOTATIONS_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(IMAGE_ANNOTATIONS_STORE_NAME);
            await store.put(canvasObject);
            await tx.complete;
            console.log('added item to the store! ' + JSON.stringify(canvasObject));
        } catch (error) {
            console.log("Error in storeAnnotation()")
        }
    }
}

/**
 * Given roomNo, retrieves all comments for given roomNo
 * @param roomNo Room Number.
 * @returns {Promise<*>}
 */
export async function retrieveAllCachedRoomComments(roomNo){
    //TODO: handle when 0 items
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(CHAT_MESSAGES_STORE_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_MESSAGES_STORE_NAME);
            let index = await store.index('chats');
            let readingsList = await index.getAll(IDBKeyRange.only(roomNo));
            await tx.complete;
            if (readingsList && readingsList.length > 0) {
                return readingsList;
            } else {
                //TODO: Implement localstorage

                // const value = localStorage.getItem(city);
                // if (value == null)
                //     return finalResults;
                // else finalResults.push(value);
                // return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        //TODO: Implement localstorage

        // const value = localStorage.getItem(city);
        // let finalResults=[];
        // if (value == null)
        //     return finalResults;
        // else finalResults.push(value);
        // return finalResults;
    }
}
window.retrieveAllCachedRoomComments = retrieveAllCachedRoomComments

/**
 * Retrieves all image annotations for given roomNo.
 * @param roomNo  Room Number.
 * @returns {Promise<*>}
 */
export async function retrieveRoomImageAnnotations(roomNo){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(IMAGE_ANNOTATIONS_STORE_NAME, 'readonly');
            let store = await tx.objectStore(IMAGE_ANNOTATIONS_STORE_NAME);
            let index = await store.index('canvas');
            let readingsList = await index.getAll(IDBKeyRange.only(roomNo));
            await tx.complete;
            if (readingsList && readingsList.length > 0) {
                return readingsList;
            } else {
                // const value = localStorage.getItem(city);
                // if (value == null)
                //     return finalResults;
                // else finalResults.push(value);
                // return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        // const value = localStorage.getItem(city);
        // let finalResults=[];
        // if (value == null)
        //     return finalResults;
        // else finalResults.push(value);
        // return finalResults;
    }
}

/**
 * Retrieves all articles stored in IDB.
 * @returns {Promise<*>}
 */
export async function retrieveArticles(){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(ARTICLES_STORE_NAME, 'readonly');
            let store = await tx.objectStore(ARTICLES_STORE_NAME);
            let index = await store.index('article');
            let readingsList = await index.getAll();
            await tx.complete;
            if (readingsList && readingsList.length > 0) {
                return readingsList;
            } else {
                return [];
                // const value = localStorage.getItem(city);
                // if (value == null)
                //     return finalResults;
                // else finalResults.push(value);
                // return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        // const value = localStorage.getItem(city);
        // let finalResults=[];
        // if (value == null)
        //     return finalResults;
        // else finalResults.push(value);
        // return finalResults;
    }
}

/**
 * Retrieves all articles in the sync queue. If no connection can be made to mongo to sync, this will ensure that
 * all articles, including those which have been added but not yet submitted are shown.
 * @returns {Promise<void>}
 */
export async function retreiveQueuedArticles(){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(QUEUED_ARTICLES_STORE_NAME, 'readonly');
            let store = await tx.objectStore(QUEUED_ARTICLES_STORE_NAME);
            let index = await store.index('queued_article');
            let readingsList = await index.getAll();
            await tx.complete;
            if (readingsList && readingsList.length > 0) {
                return readingsList;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("IDB Unavailable.")
    }
}

/**
 * Retrieves queued article given a key
 * @param key
 * @returns {Promise<null|*>}
 */
export async function retreiveQueuedArticle(key){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(QUEUED_ARTICLES_STORE_NAME, 'readonly');
            let store = await tx.objectStore(QUEUED_ARTICLES_STORE_NAME);
            let index = await store.index('queued_article');
            let readingsList = await index.getAll(IDBKeyRange.only(key));
            await tx.complete;
            if (readingsList && readingsList.length > 0) {
                return readingsList[0];
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("IDB Unavailable.")
    }
}

/**
 * Deletes article from queued_articles given article key.
 * @param key
 * @returns {Promise<void>}
 */
export async function deleteQueuedArticle(key){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(QUEUED_ARTICLES_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(QUEUED_ARTICLES_STORE_NAME).delete(key);
            await tx.complete;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("IDB Unavailable.")
    }
}

/**
 * Retrieves articles both stored in the local article store and the sync queue.
 * @returns {Promise<void>}
 */
export async function retrieveAllLocallyStoredArticles(){
    let idbArticles = await retrieveArticles();
    let queuedIdbArticles = await retreiveQueuedArticles();
    return idbArticles.concat(queuedIdbArticles)
}

/**
 * Deletes all room annotations for a given roomNo
 * @param roomNo
 * @returns {Promise<void>}
 */
export async function deleteRoomAnnotations(roomNo){
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(IMAGE_ANNOTATIONS_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(IMAGE_ANNOTATIONS_STORE_NAME);
            let index = await store.index('canvas');
            let keys = await index.getAllKeys(IDBKeyRange.only(roomNo));
            for (const key of keys) {
                store.delete(key);
            }
            await tx.complete;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("IDB Unavailable.")
    }
}

/**
 * Gets articles from MongoDB
 * @returns {Promise<*>}
 */
export async function getArticlesMongo(){
    let json = await axios.post('http://localhost:3000/getArticles',{})
    return json.data
}

/**
 * Inserts article to mongo
 * @param article
 * @returns {Promise<boolean>}
 */
export async function insertArticleMongo(article) {
    let inputData = {
        "title": article.title,
        "image": article.image,
        "description": article.description,
        "author_name": article.author_name,
        "date_of_issue": article.date_of_issue
    }
    let error = null;
    await axios.post('http://localhost:3000/insertArticle', inputData)
        .catch(err => {
            console.log(err);
            error = err
        });
    if (error == null){
        return true;
    }
    return false;
}

/**
 * Stores data from form in an object and validates before sending to IDB queue
 * @returns {Promise<void>}
 */
export async function submitNewArticle() {
    let title = document.getElementById('title_input').value
    let description = document.getElementById('description_input').value
    let author = document.getElementById('author_name').value
    let image_b64 = document.getElementById('image_b64').value
    let file_name = document.getElementById("fileUpload").value

    if((title != "")&&(description != "")&&(author != "")&&(image_b64 != "")) {
        if(file_name.toLowerCase().endsWith(".jpg") || file_name.toLowerCase().endsWith(".png")) {
            let date_of_issue = Date.now();
            let articleObject = new Article(title, image_b64, description, author, date_of_issue);

            //Add the article to IDB
            storeQueuedArticle(articleObject)
                .then(r => {
                    console.log("Submitting " + articleObject.title)
                    document.location.reload()
                })
                .catch(r => console.log("Error submitting " + articleObject.title + r));
        }
        else{
            alert("Invalid File Type. JPEG, JPG or PNG Only");
        }
    }else{
        alert("Please complete all fields");
    }
}
window.submitNewArticle = submitNewArticle;