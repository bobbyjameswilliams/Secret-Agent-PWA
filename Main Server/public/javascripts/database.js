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

async function cacheRetrievedArticle(){
    //TODO: Cache articles retrieved from mondoDB
}

async function retrieveCachedArticles(){
    //TODO: retrieve articles stored in cache
}

export async function storeComment(commentObject) {
    console.log('inserting: ' + JSON.stringify(commentObject));
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
window.storeComment = storeComment

async function retrieveAllComments(){
    //TODO: retrieve all comments given a room ID
}
window.retrieveAllComments = retrieveAllComments



