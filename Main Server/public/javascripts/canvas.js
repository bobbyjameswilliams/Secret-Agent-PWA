import * as database from './database.js';
/**
 * this file contains the functions to control the drawing on the canvas
 */

let room;
let userId;
let color = 'red', thickness = 4;
window.canvasColour = color;

/**
 * Canvas class used when storing canvas data in IDB.
 */
class Canvas{
    roomNo;
    width;
    height;
    prevX;
    prevY;
    currX;
    currY;
    color;
    thickness;

    constructor(roomNo, width, height, prevX, prevY, currX, currY, color, thickness) {
        this.roomNo = roomNo;
        this.width = width;
        this.height = height;
        this.prevX = prevX;
        this.prevY = prevY;
        this.currX = currX;
        this.currY = currY;
        this.color = color;
        this.thickness = thickness;
    }
}
/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * it is also the place where the data should be sent  via socket.io
 * @param sckt the open socket to register events on
 * @param imageUrl teh image url to download
 * @param roomNo
 * @param name
 */
export function initCanvas(sckt, image, roomNo, name, title, description, author_name, date_of_issue) {
    room = roomNo;
    userId = name;
    let socket = sckt;
    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvas = $('#canvas');
    let cvx = document.getElementById('canvas');
    let img = document.getElementById('image');
    let cardTitle = document.getElementById('cardTitle');
    let ctx = cvx.getContext('2d');

    img.src = image;
    cardTitle.innerText = title;

    // event on the canvas when the mouse is on it
    canvas.on('mousemove mousedown mouseup mouseout', function (e) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.position().left;
        currY = e.clientY - canvas.position().top;
        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            flag = false;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {
                saveToIDB(room, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness)
                drawOnCanvas(ctx, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);
                // @todo if you draw on the canvas, you may want to let everyone know via socket.io (socket.emit...)  by sending them
                // room, userId, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness
                socket.emit('draw',roomNo, userId, canvas.width, canvas.height, prevX, prevY,currX, currY,color, thickness)
                //Store IDB
            }
        }
    });

    socket.on('draw', function (room,userId,canvasWidth,canvasHeight,prevX,prevY,currX,currY,color, thickness) {
        saveToIDB(room, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness)
        drawOnCanvas(ctx, canvasWidth,canvasHeight,prevX,prevY,currX,currY,color,thickness)
    });

    $('.canvas-clear').on('click', () => {
        socket.emit('clear canvas', room)
        socket.emit('chat',room, userId, "Cleared the canvas.")
    });

    socket.on('clear canvas', () => {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        database.deleteRoomAnnotations(roomNo)
            .then(() => console.log("Annotation data removed for " + roomNo))
            .catch(r => console.log("Error removing Annotation data " + r))
        drawImageScaled(img, canvas, ctx);
    })

    // this is called when the src of the image is loaded
    // this is an async operation as it may take time
    img.addEventListener('load', () => {
        // it takes time before the image size is computed and made available
        // here we wait until the height is set, then we resize the canvas based on the size of the image
        let poll = setInterval(async function () {
            if (img.naturalHeight) {
                console.log("image listener");
                clearInterval(poll);
                // resize the canvas
                let ratioX = 1;
                let ratioY = 1;
                // if the screen is smaller than the img size we have to reduce the image to fit
                if (img.clientWidth > window.innerWidth)
                    ratioX = window.innerWidth / img.clientWidth;
                if (img.clientHeight > window.innerHeight)
                    ratioY = img.clientHeight / window.innerHeight;
                let ratio = Math.min(ratioX, ratioY);
                // resize the canvas to fit the screen and the image
                cvx.width = canvas.width = img.clientWidth * ratio;
                cvx.height = canvas.height = img.clientHeight * ratio;
                // draw the image onto the canvas
                await drawImageScaled(img, cvx, ctx);
                retrieveCanvas(room);
                // hide the image element as it is not needed
                img.style.display = 'none';
            }
        }, 10);
    })
}
window.initCanvas = initCanvas;




/**
 * called when it is required to draw the image on the canvas. We have resized the canvas to the same image size
 * so ti is simpler to draw later
 * @param img
 * @param canvas
 * @param ctx
 */
function drawImageScaled(img, canvas, ctx) {
    //TODO: Remove
    console.log("Drawing scaled image...")
    // get the scale
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    //ctx.clearCache()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function saveToIDB(roomNo, canvasWidth, canvasHeight, prevX, prevY,currX, currY, color, thickness) {
    let canvasObject = new Canvas(roomNo, canvasWidth, canvasHeight, prevX, prevY, currX, currY,color, thickness)
    database.storeAnnotation(canvasObject)
        .then(r => console.log("Annotation Stored Successfully"))
        .catch(r => console.log(() => console.log("error storing annotation")));
}

/**
 * this is called when we want to display what we (or any other connected via socket.io) draws on the canvas
 * note that as the remote provider can have a different canvas size (e.g. their browser window is larger)
 * we have to know what their canvas size is so to map the coordinates
 * @param ctx the canvas context
 * @param canvasWidth the originating canvas width
 * @param canvasHeight the originating canvas height
 * @param prevX the starting X coordinate
 * @param prevY the starting Y coordinate
 * @param currX the ending X coordinate
 * @param currY the ending Y coordinate
 * @param color of the line
 * @param thickness of the line
 */
function drawOnCanvas(ctx, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
    //get the ration between the current canvas and the one it has been used to draw on the other comuter
    let ratioX= canvas.width/canvasWidth;
    let ratioY= canvas.height/canvasHeight;
    // update the value of the points to draw
    prevX*=ratioX;
    prevY*=ratioY;
    currX*=ratioX;
    currY*=ratioY;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();
}

/**
 * Restores the canvas image from previous session
 */

function retrieveCanvas(roomNo){
    console.log('retrieve canvas');
    database.retrieveRoomImageAnnotations(roomNo)
        .then(r => r.forEach(restoreCanvas))
        .catch(r => console.log(r))
}

function restoreCanvas(canvasData){
    //Defining all the parameters
    let cvx = document.getElementById('canvas');
    let ctx = cvx.getContext('2d');
    let width = canvasData.width;
    let height = canvasData.height;
    let prevX = canvasData.prevX;
    let prevY = canvasData.prevY;
    let currX = canvasData.currX;
    let currY = canvasData.currY;
    let color = canvasData.color;
    let thickness = canvasData.thickness;
    drawOnCanvas(ctx, width, height, prevX, prevY, currX, currY, color, thickness);
}

/**
 * Changes color of annotation.
 * @param colour Color to be used for annotation.
 */
function changeColor(colour){
    color = colour;
    window.canvasColour = color;
}
window.changeColor = changeColor

function removeCanvasSocketListeners(){
    socket.removeAllListeners();
}
window.removeCanvasSocketListeners = removeCanvasSocketListeners
