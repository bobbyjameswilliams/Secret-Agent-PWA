////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

// const Article = new Schema(
//     {
//         title: {type: String, required: true, max: 100},
//         file_path: {type: String, max: 100},
//         description: {type: String, max: 100},
//         author_name: {type: String, max: 100},
//         date_of_issue: {type: Date},
//     }
// );

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
                if (!upgradeDb.objectStoreNames.contains(ARTICLES_STORE_NAME)) {
                    let forecastDB = upgradeDb.createObjectStore(ARTICLES_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    forecastDB.createIndex('article', 'article', {unique: true, multiEntry: false});
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

async function storeM



