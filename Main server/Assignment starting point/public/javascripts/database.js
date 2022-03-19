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
 * Sets up the IDB and object stores
 * @returns {Promise<void>}
 */
async function initDatabase(){

}