////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

//var idb = require('../idb/index.js');

/**
*class Comment{
*    roomNo;
*    userID;
*    date_of_issue;
*    chatText;
*
*    constructor(id, roomNo,userID,date_of_issue,chatText) {
*        this.roomNo = roomNo;
*        this.userID = userID;
*        this.date_of_issue = date_of_issue;
*        this.chatText = chatText;
*    }
*}
*/

let db

// Databases
const APP_DB_NAME = 'db_app_1';
// Stores
const ARTICLES_STORE_NAME= 'store_articles';
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
                //Creating image annotations store
                if (!upgradeDb.objectStoreNames.contains(IMAGE_ANNOTATIONS_STORE_NAME)) {
                    let articleDB = upgradeDb.createObjectStore(IMAGE_ANNOTATIONS_STORE_NAME, {
                        keyPath: 'roomNo',
                        autoIncrement: true
                    });
                    articleDB.createIndex('canvas', 'roomNo', {unique: false, multiEntry: true});
                }
                //Creating Comments Store
                if (!upgradeDb.objectStoreNames.contains(CHAT_MESSAGES_STORE_NAME)) {
                    let articleDB = upgradeDb.createObjectStore(CHAT_MESSAGES_STORE_NAME, {
                        keyPath: 'roomNo',
                        autoIncrement: true
                    });
                    articleDB.createIndex('chats', 'roomNo', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;

/**
 * Caches retrieved article in IDB store.
 * @param article
 * @returns {Promise<void>}
 */


export async function syncArticles(){
    let mongoArticles = await getArticlesMongo();
    await storeArticles(mongoArticles)
    //Retrieve all IDB articles, these could include new ones submitted offline
    let idbArticles = await retrieveArticles();
    console.log("Begin comparison of the lists")
    //var difference = idbArticles.filter(x => mongoArticles.indexOf(x._id) === -1);
    const isSameArticle = (mongoArticles, idbArticles) => mongoArticles._id === idbArticles._id;

// Get items that only occur in the left array,
// using the compareFunction to determine equality.
    const onlyInLeft = (left, right, compareFunction) =>
        left.filter(leftValue =>
            !right.some(rightValue =>
                compareFunction(leftValue, rightValue)));

    const onlyInA = onlyInLeft(mongoArticles, idbArticles, isSameArticle);
    const onlyInB = onlyInLeft(idbArticles, mongoArticles, isSameArticle);

    const result = [...onlyInA, ...onlyInB];
    console.log(result);
    //console.log(difference);
    console.log(mongoArticles);
    console.log(idbArticles);
}

export async function storeArticle(article){
    console.log("Inside storeArticle")
    console.log('inserting: ' + JSON.stringify(article));
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

export async function storeArticles(articles){
    console.log("Inside storeArticles")
    articles.forEach(element => storeArticle(element))
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
            console.log('fetching all cached room comments for : ' + roomNo);
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
        console.log("Else in retrieve")
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
        console.log("Else in retrieve")
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
    console.log("Retrieving articles from idb...")
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
                console.log("Inside retrieveArticles()")
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
        console.log("Else in retrieve")
        // const value = localStorage.getItem(city);
        // let finalResults=[];
        // if (value == null)
        //     return finalResults;
        // else finalResults.push(value);
        // return finalResults;
    }
}

export async function getArticlesMongo(){
    let json = await axios.post('http://localhost:3000/getArticles',{})
    let dataReturned = json.data;
    await storeArticles(dataReturned);

    return dataReturned
}

export async function sendAjaxQuery(url, data) {
    console.log("beginning ajax query")
    axios.post(url , data)
        .then (function (dataR) {
            console.log("successful ajax query")
            console.log(dataR.data)
        })
        .catch( function (response) {
            console.log("unsuccessful ajax query")
        })
}
