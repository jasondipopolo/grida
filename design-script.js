// Table of Contents
    // Ensuring the wrapped JS only loads *after* HTML
        // Referencing Elements in the DOM
        // Canvas History Functionality
        // Zoom Tool
        // Edit Stroke Weight Tool
        // Show hidden content upon grid selection
        // Upload Your Own Grid - File Uploader 
        // Coloring Shapes on-click
        // Drag-to-Draw
        // "Apply Color to All Cells" Button
        // "Apply Stroke Color to All Strokes" Button
        // "Apply Color to Same Shapes" Button
        // "Export Design" Button
        // "Choose a Grid Template" Dropdown
    // End of event listener that wraps all of my JS (checks to see that the page has loaded before running)

// --------------------------------------------------------------------------------------------

// Ensuring the wrapped JS only loads *after* HTML
document.addEventListener('DOMContentLoaded', () => {

// --------------------------------------------------------------------------------------------

// Referencing Elements in the DOM

const svgFileInput = document.getElementById('svgFileInput');
const colorPicker = document.getElementById('colorPicker');
const applyColorButton = document.getElementById('applyColorButton');
const applyStrokeColorButton = document.getElementById('applyStrokeColorButton');
const applyColorToSameShapesButton = document.getElementById('applyColorToSameShapesButton');
// const clearDesignButton = document.getElementById('applyColorButton');
const canvas = document.getElementById('canvas');
const app = document.getElementById('app');
// const undoButton = document.getElementById('undoButton');
let isDragging = false;

// --------------------------------------------------------------------------------------------

// Canvas History Functionality

// let canvasHistory = [];

// const initialCanvasState = canvas.innerHTML;
// canvasHistory.push(initialCanvasState);

// Inside functions that make changes to the canvas
// function updateCanvasState() {
//     const updatedCanvasState = canvas.innerHTML;
//     canvasHistory.push(updatedCanvasState);
// }

// undoButton.addEventListener('click', () => {
//     console.log('Undo Clicked');
//     isDragging = false; // Reset dragging state
//     if (canvasHistory.length > 1) {
//         canvasHistory.pop(); // Remove current state
//         const previousState = canvasHistory[canvasHistory.length - 1];
//         canvas.innerHTML = previousState; // Revert canvas to previous state
//     }
//     console.log(canvasHistory);
//     console.log(isDragging);
// });

// --------------------------------------------------------------------------------------------

// Zoom Tool

const canvasWidthInput = document.getElementById('canvasWidthInput');
let timeoutId; // For storing the timeout ID

canvasWidthInput.addEventListener('input', () => {
    clearTimeout(timeoutId); // Clear previous timeout
    timeoutId = setTimeout(liveChangeCanvasWidth, 400); // Delay execution by 300 milliseconds
});

function liveChangeCanvasWidth() {
    const newCanvasWidth = parseFloat(canvasWidthInput.value);
    if (!isNaN(newCanvasWidth)) {
        canvas.style.maxWidth = newCanvasWidth + 'px';
    }
}   

// --------------------------------------------------------------------------------------------

// Edit Stroke Weight Tool

const strokeWeightInput = document.getElementById('strokeWeightInput');
strokeWeightInput.addEventListener('input', liveChangeStrokeWeights);

function liveChangeStrokeWeights() {
    const newStrokeWeight = parseFloat(strokeWeightInput.value);
    if (!isNaN(newStrokeWeight)) {
        const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed
        shapes.forEach((shape) => {
            shape.style.strokeWidth = newStrokeWeight;
        });
    }
}   

// --------------------------------------------------------------------------------------------

// Show hidden content upon grid selection

function showSvgEditTools(){
    colorPicker.style.visibility = 'visible'
    applyColorButton.style.visibility = 'visible'
    exportSvgButton.style.visibility = 'visible'
    strokeWeightInput.style.visibility = 'visible'
    canvasWidthInput.style.visibility = 'visible'
    applyStrokeColorButton.style.visibility = 'visible'
    applyColorToSameShapesButton.style.visibility = 'visible'
    // clearDesignButton.style.visibility = 'visible'
    // undoButton.style.visibility = 'visible'
}
        
// --------------------------------------------------------------------------------------------

// Upload Your Own Grid - File Uploader 

svgFileInput.addEventListener('change', handleFileInput);
    
    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const svgContent = e.target.result;
            canvas.innerHTML = svgContent;
            showSvgEditTools();
            addColorChangeListeners();
            addColorChangeOnDragListeners();
        };
        reader.readAsText(file);
        }
    }

// --------------------------------------------------------------------------------------------

// Coloring Shapes on-click

// Each shape listens for click 
function addColorChangeListeners() {
    const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed
    shapes.forEach((shape) => {
    shape.addEventListener('click', handleShapeClick);

    //If fill is none, apply white because otherwise, shape is unclickable
    if (shape.style.fill = 'none' || shape.style.fill === 'none' ) {
        shape.style.fill = 'white';
        }          
    });
}

// Handles shape click
function handleShapeClick(event) {
    const selectedColor = colorPicker.value;
    const shape = event.target;

    // Check if the shape has a style attribute
    if (shape.hasAttribute('style')) {
    // Parse the style attribute to get existing styles
    const existingStyles = shape.getAttribute('style');
    // Create a new style attribute with modified fill color
    shape.setAttribute('style', existingStyles.replace(/fill:[^;]+;/, `fill:${selectedColor};`));
    } else {
    shape.setAttribute('fill', selectedColor);
    }
//   updateCanvasState();
//   console.log(canvasHistory);
}

// --------------------------------------------------------------------------------------------

// Drag-to-Draw

// Each shape listens for drag
function addColorChangeOnDragListeners() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // canvas.addEventListener('touchstart', handleTouchStart);
    // canvas.addEventListener('touchmove', handleTouchMove);
    // document.body.addEventListener('touchend', handleTouchEnd);

    // Applies listeners to hear for drag and draw by user
    const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed

    shapes.forEach((shape) => {
        shape.addEventListener('mouseenter', handleShapeMouseEnter);
        shape.addEventListener('mouseleave', handleShapeMouseLeave);
        // shape.addEventListener('touchenter', handleShapeTouchEnter);
        // shape.addEventListener('touchleave', handleShapeTouchLeave);
    });
}
        
function handleMouseDown(event) {
    // console.log('MouseDown');
    isDragging = true;

    // Apply color change logic to the clicked shape
    const selectedColor = colorPicker.value;
    const clickedShape = event.target;
    if (clickedShape.hasAttribute('style')) {
        const existingStyles = clickedShape.getAttribute('style');
        clickedShape.setAttribute('style', existingStyles.replace(/fill:[^;]+;/, `fill:${selectedColor};`));
    } else {
        clickedShape.setAttribute('fill', selectedColor);
    }

    // updateCanvasState(); // Save the current canvas state
}

// Pseudo Code to add "color same shape" functionality on drag
// in the handleMouseDown function, take same shape colorinig functionality and add 2nd if statement for dragging scenario (mimicking 1st if statement)

// if our clicked shape has a style attribute and sameShapes button is ON...
// for each SVG shape, get it's attribute of "d"
// For each shape check if it's "d" attribute === the "d" of our clicked shape
// if yes, color that shape

function handleMouseUp() {
    // console.log('MouseUp');
    isDragging = false;
    
}

function handleMouseLeave() {
    // console.log('MouseLeave');
    isDragging = false;
}

function handleShapeMouseEnter(event) {
    if (isDragging) {
        event.target.setAttribute('data-hovered', 'true');
    }
}
function handleShapeMouseLeave(event) {
    event.target.removeAttribute('data-hovered');
}
function handleMouseMove(event) {
    if (isDragging) {
        const selectedColor = colorPicker.value;
        const hoveredShapes = canvas.querySelectorAll('[data-hovered="true"]');

        hoveredShapes.forEach((shape) => {
            shape.style.fill = selectedColor;
        });
        // if isApplyColorToSameShapesButtonActive...
        // ...for each hovered shape, get the "d" attribute value if it is a path, get the "height" and "width" if it is a rect or circle
        // for each other shape, if it is a path and has d value equaling the hovered shape's, apply user's fill Color to all other shapes
        // for each other shape, if it is a rect or circle and has height and width value equaling the hovered shape's, apply user's fill Color to all other shapes
    }
    if (isDragging && isApplyColorToSameShapesButtonActive) {
        const selectedColor = colorPicker.value;
        const hoveredShapes = canvas.querySelectorAll('[data-hovered="true"]');

        if (hoveredShapes.length > 0) {
            const clickedShape = hoveredShapes[0]; // Assuming we have only one hovered shape

            const clickedShapeD = clickedShape.getAttribute("d");
            const clickedShapeWidth = clickedShape.getAttribute("width");
            const clickedShapeHeight = clickedShape.getAttribute("height");
            
            const svgShapes = document.querySelectorAll("path, rect, circle");
            
            svgShapes.forEach(function (otherShape) {
                if (otherShape.tagName === "path" && otherShape.getAttribute("d") === clickedShapeD) {
                    // For path elements, compare the "d" attribute
                    otherShape.style.fill = selectedColor;
                } else if ((otherShape.tagName === "rect" || otherShape.tagName === "circle") &&
                    otherShape.getAttribute("width") === clickedShapeWidth &&
                    otherShape.getAttribute("height") === clickedShapeHeight) {
                    // For rect and circle elements, compare the "width" and "height" attributes
                    otherShape.style.fill = selectedColor;
                }
            });
        }
    }

}
    
// handleTouchMove
// function handleShapeTouchEnter(event) {
//     if (isDragging) {
//         event.target.setAttribute('data-hovered', 'true');
//     }
// }
// function handleShapeTouchLeave(event) {
//     event.target.removeAttribute('data-hovered');
// }
// function handleTouchMove(event) {
//     if (isDragging) {
//         const selectedColor = colorPicker.value;
//         const hoveredShapes = canvas.querySelectorAll('[data-hovered="true"]');

//         hoveredShapes.forEach((shape) => {
//             // Apply color change logic here
//             // For example, change the fill color of the shape
//             shape.style.fill = selectedColor;
//         });
//     }
// }

// --------------------------------------------------------------------------------------------

// "Apply Color to All Cells" Button
    
// Apply color button listener
applyColorButton.addEventListener('click', () => {
    const selectedColor = colorPicker.value;
    const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed
    shapes.forEach((shape) => {
    if (shape.hasAttribute('style')) {
        const existingStyles = shape.getAttribute('style');
        shape.setAttribute('style', existingStyles.replace(/fill:[^;]+;/, `fill:${selectedColor};`));
    } else {
        shape.setAttribute('fill', selectedColor);
    }
    });
//   updateCanvasState();
//   console.log(canvasHistory);
});

// --------------------------------------------------------------------------------------------

// "Apply Stroke Color to All Strokes" Button

// Apply stroke color button listener
applyStrokeColorButton.addEventListener('click', () => {
    const selectedColor = colorPicker.value;
    const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed
    shapes.forEach((shape) => {
        if (shape.hasAttribute('style')) {
        const existingStyles = shape.getAttribute('style');
        shape.setAttribute('style', existingStyles.replace(/stroke:[^;]+;/, `stroke:${selectedColor};`));
        } else {
        shape.setAttribute('stroke', selectedColor);
        }
    });
    //   updateCanvasState();
    //   console.log(canvasHistory);
    });

// --------------------------------------------------------------------------------------------

//pseudo
// - Determine if SameShapes functionality is on of off (via making it a boolean)
// - Listen for the button click that will toggle on/off SameShapes functionality
// - Make SameShapes toggle-able so it has a on and off state

// - Select all SVG Shapes and define them under the name svgShapes
// - For each shape listen for a click
// - If that shapes is clicked, ask if sameShapes is active. If so, get it's value that defines the shape (height, width, or d)
// - Then for each other shape, if it is a path and has d value equaling the clicked shape's, apply user's fill Color
// - If it is a rect or circle and has height and width value equaling the clicked shape's, apply user's fill Color

// "Apply Color to Same Shapes" Button

let isApplyColorToSameShapesButtonActive = false;

// Button appearance in active and inactive state
applyColorToSameShapesButton.addEventListener('click', () => {
    applyColorToSameShapesButton.classList.toggle("bg-slate-100"); 
    applyColorToSameShapesButton.classList.toggle("bg-slate-400");
    applyColorToSameShapesButton.classList.toggle("dark:bg-slate-50"); 
    applyColorToSameShapesButton.classList.toggle("dark:bg-slate-500");
    applyColorToSameShapesButton.classList.toggle("notActiveButton");
    applyColorToSameShapesButton.classList.toggle("activeButton");

    // Toggle on/off sameShapes button
    isApplyColorToSameShapesButtonActive = !isApplyColorToSameShapesButtonActive;

    

    // Add click event listeners to the SVG shapes
    const svgShapes = document.querySelectorAll("path, rect, circle"); // Adjust the selector as needed

    svgShapes.forEach(function (shape) {
        shape.addEventListener("click", function () {
            // Check if the button is active
            if (isApplyColorToSameShapesButtonActive) {

                // Get the color from the color picker
                const fillColor = colorPicker.value;

                // Get the "d" attribute value of the clicked shape
                const clickedShapeD = shape.getAttribute("d");
                const clickedShapeWidth = shape.getAttribute("width");
                const clickedShapeHeight = shape.getAttribute("height");

                // Loop through all shapes and set their fill based on the type of shape
                svgShapes.forEach(function (otherShape) {
                    if (otherShape.tagName === "path" && otherShape.getAttribute("d") === clickedShapeD) {
                        // For path elements, compare the "d" attribute
                        otherShape.style.fill = fillColor;
                    } else if ((otherShape.tagName === "rect" || otherShape.tagName === "circle") &&
                            otherShape.getAttribute("width") === clickedShapeWidth &&
                            otherShape.getAttribute("height") === clickedShapeHeight) {
                        // For rect and circle elements, compare the "width" and "height" attributes
                        otherShape.style.fill = fillColor;
                    }
                });
            }
        });
        // - For each shape listen for a "mouseDown" (instead of click this time)
        
        // - if isApplyColorToSameShapesButtonActive

    });

});

// Shapes are listening for click and on that click...
// if the sameShapes button is set to ON...
// When a shape is clicked...
// Get the d attribute of that clicked shape
// THEN loop through all shapes and change their fill if their "d" matches the clicked shape's "d"
    
// If button is active AND shape is clicked AND shape is a path... trigger event
// Get clicked path shape's value of "d"
// for each shape, check if it has a value of "d"
// If the shape has a value of "d," set the shape fill to colorPicker.value
// else check to see if the button is active AND shape is clicked AND shape is a rect... trigger event for rect's

// --------------------------------------------------------------------------------------------

// "Export Design" Button

const exportSvgButton = document.getElementById('exportSvgButton');
exportSvgButton.addEventListener('click', exportSvg);
// const excludeWhiteShapes = document.getElementById('excludeWhiteShapesCheckbox').checked;

function exportSvg() {
    const svgContent = canvas.innerHTML;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified_svg.svg';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
    
// --------------------------------------------------------------------------------------------

// "Choose a Grid Template" Dropdown
    
// Grid Selector Logic
const gridSelector = document.getElementById('grid-selector');

gridSelector.addEventListener('change', handleGridSelection);

function handleGridSelection() {
    const selectedOption = gridSelector.value;
    const svgUrl = getSvgUrlForOption(selectedOption);

    fetchAndDisplaySvg(svgUrl);
}

function getSvgUrlForOption(selectedOption) {
    // Define a mapping of options to corresponding SVG URLs
    const svgUrlMap = {
        'square-radial': 'https://gistcdn.githack.com/grammarOfOrnament/fb731cdf1d20c6c1a3f7ba0f569dca31/raw/65dd7d71b6ce925eea547fa2ce4da37913736907/square-radial.svg',
        'square': 'https://gistcdn.githack.com/grammarOfOrnament/38b6aab5cd34ed555e6d3816c76ba5a0/raw/1d7cc313bb8b26b29b689446541584d3d757631e/square.svg',
        'radial': 'https://gistcdn.githack.com/grammarOfOrnament/8109e198271949e1a0f0f3ce023e836e/raw/44a0ccda777f5988e72a1433f479cd2335161c61/radial.svg',
        
        'shippo': 'https://gistcdn.githack.com/grammarOfOrnament/cfb789ac01bfef9267d3510a720dbf6f/raw/94a8e53968aeb5b5917fea8b6b5171dd11e707f5/shippo.svg',
        'seigaiha': 'https://gistcdn.githack.com/grammarOfOrnament/aacef17ab29331812de99f70fc24adaf/raw/c5fe7a77908be01bee1dad47fe73737924d7eeec/seigaiha.svg',
        'polar8': 'https://gistcdn.githack.com/grammarOfOrnament/490db15e4965fa8cd8690b57767d3e63/raw/444c51b59f0b62e3bee8fe80f974e2492e27654a/polar8.svg',
        'isometric': 'https://gistcdn.githack.com/grammarOfOrnament/452522efcfb8ec5e4d9bcef4e7a256b0/raw/cb0d36831b0749a9938bb3d1b0780e9f18989a2b/isometric-2.svg',
        '3disometric': 'https://gistcdn.githack.com/grammarOfOrnament/28a6516cc3822eeed0220927d08e9c35/raw/6cb7eca6a4519df6bf13482891afede68005f96c/3d_isometric-2.svg',
        
        'square-radial-4-corners': 'https://gistcdn.githack.com/grammarOfOrnament/0ab408858757192f292f8c30929c09b5/raw/b3bdae7bfea8d63ab26fbecd0b9d6b5a2aadeba6/square-radial-4corners.svg',
        'square-radial-2-corners-bottom': 'https://gistcdn.githack.com/grammarOfOrnament/2c2b591d50277638c0f2935e141b374c/raw/c09ba2cb0056cac5b3b8d3a819709384a3ee717f/square-radial-2corners.svg',
        'square-radial-mirrored-halves': 'https://gistcdn.githack.com/grammarOfOrnament/823428611660f81aa00825a300f8d015/raw/9c2a3c631c2aba2619fc4e15919c3b30be391f71/radial-halves-mirrored.svg',
        'square-radial-stacked': 'https://gistcdn.githack.com/grammarOfOrnament/d5cbedad16400e8a55486bbb6d177115/raw/69831400867bf34f1b95ea0c08d982e050dd0950/square-radial-stacked.svg',
        'square-radial-stacked-overlapping': 'https://gistcdn.githack.com/grammarOfOrnament/9353cfedf19839382625acc0b183928d/raw/a6a1ea97bd3affafde0fbaa9d2ea64c1def5adc4/square-radial-stacked-overlapping.svg',
        'square-radial-top-half': 'https://gistcdn.githack.com/grammarOfOrnament/77fa5c644c4871668eb5f3af6315002b/raw/40850e6d80ff04fd057d56f69772085cf2d1300e/square-radial-top-half.svg',
        'square-radial-bottom-half': 'https://gistcdn.githack.com/grammarOfOrnament/5391085876239a1f7c24400a520d0f2d/raw/15b8e6e787f20bd7eeb82e9c1d058f897acb2d10/square-radial-bottom-half.svg',
        'square-radial-1-corner': 'https://gistcdn.githack.com/grammarOfOrnament/e166a57443d45b9f7ddf633118738d78/raw/8025e3e520a3bae83c234d866ffb1d8544c85563/square-radial-1corner.svg',
        
        'logarithmic-horizontals-noVerticals': 'https://gistcdn.githack.com/grammarOfOrnament/3b06b886c1f8c3c120f8cc1ae601555d/raw/51af4c2635d858eae2c7f29967026917e7a7ecae/logarithmic-horizontals-noVerticals-2.svg',
        'logarithmic-horizontals-nonLogVerticals': 'https://gistcdn.githack.com/grammarOfOrnament/f7dd50ef8582a5aa910f20407b63b69f/raw/ad0c782dd9f4b82e7c5e3ea84d73368b118de9a5/logarithmic-horizontals-nonLogVerticals.svg',
        'logarithmic-horizontals-and-verticals': 'https://gistcdn.githack.com/grammarOfOrnament/a579b2fc0a83d0a4fe57ae2d686204e3/raw/499a6d64244cf47b784d94af7495f4b156609124/logarithmic-horizontals-and-verticals.svg',
        'sphere-verticals': 'https://gistcdn.githack.com/grammarOfOrnament/edad4a08e8bf4838246b9c523209544e/raw/3f859b332b27497a572456d928a605888b020424/sphere-verticals-2.svg',
        'sphere-verticals-and-horizontals': 'https://gistcdn.githack.com/grammarOfOrnament/3420cd1453526ac31851d614eac32a23/raw/6a02844d1d0214b6c78c4d4cdcf6aae21ef2826e/sphere-verticals-and-horizontals.svg',
        'logarithmic-polar': 'https://gistcdn.githack.com/grammarOfOrnament/3b94f22a1bfe69613d556a159abf2cb5/raw/a9b5a528b607ecea304a39cefbdee07f58a69596/logarithmic-polar-2.svg',
        'logarithmic-radial': 'https://gistcdn.githack.com/grammarOfOrnament/b675d66f9847b89c4a08604e4ed8de42/raw/02a5095fca12aac521724d34c227252458251961/logarithmic-radial.svg',
        'logarithmic-polar-with-logSpokes': 'https://gistcdn.githack.com/grammarOfOrnament/ce678ee783d021b0d6894df6b7c15dd4/raw/944f51214227dc41a8bd5fb065b36a9895ced576/logarithmic-polar-logSpokes.svg',

        // Add other options and URLs here
    };
    
    return svgUrlMap[selectedOption];
}

function fetchAndDisplaySvg(svgUrl) {
    fetch(svgUrl)
        .then(response => response.text())
        .then(svg => {
            canvas.innerHTML = svg;
            showSvgEditTools()
            addColorChangeListeners();
            addColorChangeOnDragListeners();
            // updateCanvasState();
        });
}

// --------------------------------------------------------------------------------------------

// End of event listener that wraps all of my JS (checks to see that the page has loaded before running)

      });
    