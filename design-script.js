// Ensures JS only loads *after* HTML
document.addEventListener('DOMContentLoaded', () => {

    // Referencing Elements in the DOM
    const svgFileInput = document.getElementById('svgFileInput');
    const colorPicker = document.getElementById('colorPicker');
    const applyColorButton = document.getElementById('applyColorButton');
    const clearDesignButton = document.getElementById('applyColorButton');
    const canvas = document.getElementById('canvas');
    const app = document.getElementById('app');
    const undoButton = document.getElementById('undoButton');
    let isDragging = false;

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
   
    

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // canvas.addEventListener('touchstart', handleTouchStart);
    // canvas.addEventListener('touchmove', handleTouchMove);
    // document.body.addEventListener('touchend', handleTouchEnd);

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
    

    function showSvgEditTools(){
        colorPicker.style.visibility = 'visible'
        applyColorButton.style.visibility = 'visible'
        exportSvgButton.style.visibility = 'visible'
        strokeWeightInput.style.visibility = 'visible'
        canvasWidthInput.style.visibility = 'visible'
        // clearDesignButton.style.visibility = 'visible'
        // undoButton.style.visibility = 'visible'
    }
        
    // Event Listener for File Input
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
            };
            reader.readAsText(file);
          }
        }
    
    // Listens for color change
        function addColorChangeListeners() {
          const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed
          shapes.forEach((shape) => {
            shape.addEventListener('click', handleShapeClick);
    
            //If fill is none, apply white because otherwise, shape is unclickable
            if (shape.style.fill = 'none' || shape.style.fill === 'none' ) {
                shape.style.fill = 'white';
              }          
            });
    
          // Applies listeners to hear for drag and draw by user
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
        function handleMouseUp() {
            // console.log('MouseUp');
            isDragging = false;
            
        }

        function handleMouseLeave() {
            // console.log('MouseLeave');
            isDragging = false;
        }
        

        // function handleTouchStart() {
        //     isDragging = true;
        // }
        // function handleTouchEnd() {
        //     isDragging = false;
        // }
        
        
    
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
                    // Apply color change logic here
                    // For example, change the fill color of the shape
                    shape.style.fill = selectedColor;
                });
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
    
    
    // Export SVG Button
    const exportSvgButton = document.getElementById('exportSvgButton');
    exportSvgButton.addEventListener('click', exportSvg);
    // const excludeWhiteShapes = document.getElementById('excludeWhiteShapesCheckbox').checked;
    
    function exportSvg() {
        // console.log(excludeWhiteShapes)
        console.log("hello?")

        const svgContent = canvas.innerHTML;

        // if (excludeWhiteShapes) {
        //     console.log("if statement triggered")
        //     const parser = new DOMParser();
        //     const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            
        //     const whiteShapes = svgDoc.querySelectorAll('[fill="white"], [fill="#FFFFFF"], [style*="fill:white"], [style.fill="#FFFFFF"]');
        //     whiteShapes.forEach(shape => shape.remove());
            
        //     svgContent = svgDoc.documentElement.outerHTML;
        // }    

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
                'square-radial': 'https://gistcdn.githack.com/jasondipopolo/45a2247976364937cf3e21cc2528abf9/raw/46727c0f54a16f3e16353d4594eccd0f69231fa9/square-radial.svg',
                'square': 'https://gistcdn.githack.com/jasondipopolo/38b6aab5cd34ed555e6d3816c76ba5a0/raw/1d7cc313bb8b26b29b689446541584d3d757631e/square.svg',
                'radial': 'https://gistcdn.githack.com/jasondipopolo/2b1b0ae0acb89ed7259230fefe095e0f/raw/cfa3598a4f27fb90a3af036f95247f1bbeb97e36/radial.svg',
                'shippo': 'https://gistcdn.githack.com/jasondipopolo/cfb789ac01bfef9267d3510a720dbf6f/raw/94a8e53968aeb5b5917fea8b6b5171dd11e707f5/shippo.svg',
                'seigaiha': 'https://gistcdn.githack.com/jasondipopolo/aacef17ab29331812de99f70fc24adaf/raw/c5fe7a77908be01bee1dad47fe73737924d7eeec/seigaiha.svg',
                'polar8': 'https://gistcdn.githack.com/jasondipopolo/490db15e4965fa8cd8690b57767d3e63/raw/444c51b59f0b62e3bee8fe80f974e2492e27654a/polar8.svg',
                'isometric': 'https://gistcdn.githack.com/jasondipopolo/56ec07f9b9aa26fa44837cb7b92c48d6/raw/dd7a52a3b379eee8ab29899f99c197498c7a0290/isometric.svg',
                '3disometric-large': 'https://gistcdn.githack.com/jasondipopolo/d539f4a8539cdbf1969285a30e4d84b6/raw/5a31f2c703d22133767cbdf8e259b93fe9952c44/3disometric-large.svg',
                'square-radial-4-corners': 'https://gistcdn.githack.com/jasondipopolo/3225be2c61ae3e3c7291837307131e44/raw/e21da1e5f920af88dcd47a6b6e75ec6374b7aceb/square-radial-4corners.svg',
                'square-radial-2-corners-bottom': 'https://gistcdn.githack.com/jasondipopolo/7a905473107daba8244b3b8a2f510352/raw/466db60136e77588692a9cb80a0d36c46a664506/square-radial-2-corners-bottom.svg',
                'square-radial-mirrored-halves': 'https://gistcdn.githack.com/jasondipopolo/c4d95729a08fca8ee3e5cf37a7b0a222/raw/119cb5c432a66d2937d86ddb97aed72cb00e1459/square-radial-mirrored-halves.svg',
                'square-radial-stacked': 'https://gistcdn.githack.com/jasondipopolo/0558ac748e07e615765f0eeeaa809ef3/raw/d55c72fc12cace49f8b355c3086e06638e410442/square-radial-stacked.svg',
                'square-radial-stacked-overlapping': 'https://gistcdn.githack.com/jasondipopolo/cbcca1b686f126dbad00de9e914028be/raw/bb2764b3c17a864921e0df1e8716c27c31e65cfb/square-radial-stacked-overlapping.svg',
                'square-radial-top-half': 'https://gistcdn.githack.com/jasondipopolo/27ef60ec9471f95636e9fe1c29484473/raw/65ce3942df9ff1448860449ed1c252cd7f5b2649/square-radial-topHalf.svg',
                'square-radial-bottom-half': 'https://gistcdn.githack.com/jasondipopolo/2fe998dec93f9d3a8ce1a23d0caf0248/raw/779f86dba18e596a3953f1415f6ad7a205a74908/square-radial-bottomHalf.svg'
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
                    // updateCanvasState();
                });
        }
    
        // Modify the exportSvg function to handle both user-uploaded SVGs and fetched SVGs
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
    
    
      });
    