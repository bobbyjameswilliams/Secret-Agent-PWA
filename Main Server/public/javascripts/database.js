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
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    appIDB1.createIndex('article', 'article', {unique: false, multiEntry: true});
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
                    let articleDB = upgradeDb.createObjectStore(CHAT_MESSAGES_STORE_NAME, {
                        keyPath: 'id',
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
 * Caches retrieved articles in IDB store.
 * @param article
 * @returns {Promise<void>}
 */
async function cacheRetrievedArticles(article){
    //if articleID doesnt already exist in DB, then add it in
    console.log('inserting: ' + JSON.stringify(commentObject));
    if (!db)
        await initDatabase();
    console.log(db)
    if (db) {
        try {
            let tx = await db.transaction(ARTICLES_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(ARTICLES_STORE_NAME);
            await store.put(commentObject);
            await tx.complete;
            console.log('added item to the store! ' + JSON.stringify(commentObject));
        } catch (error) {
            console.log("Error in storeComment()")
        }
    }
}

async function retrieveCachedArticles(){

}

async function syncArticles(){

}

/**
 * Stores comment object in IDB.
 * @param commentObject Comment object.
 * @returns {Promise<void>}
 */
export async function storeComment(commentObject) {
    if (!db)
        await initDatabase();
        console.log(db)
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
    console.log(db)
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