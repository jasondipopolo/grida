// Ensures JS only loads *after* HTML
document.addEventListener('DOMContentLoaded', () => {

    // Referencing Elements in the DOM
        const svgFileInput = document.getElementById('svgFileInput');
        const colorPicker = document.getElementById('colorPicker');
        const applyColorButton = document.getElementById('applyColorButton');
        const canvas = document.getElementById('canvas');
        const app = document.getElementById('app');
        const undoButton = document.getElementById('undoButton');
        let isDragging = false;
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    document.body.addEventListener('touchend', handleTouchEnd);
    
        function showSvgEditTools(){
            colorPicker.style.visibility = 'visible'
            applyColorButton.style.visibility = 'visible'
            exportSvgButton.style.visibility = 'visible'
            undoButton.style.visibility = 'visible'
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
                shape.addEventListener('touchenter', handleShapeTouchEnter);
                shape.addEventListener('touchleave', handleShapeTouchLeave);
            });
        }
    
        
        function handleMouseDown(event) {
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
        }
        function handleMouseUp() {
            isDragging = false;
        }
        function handleTouchStart() {
            isDragging = true;
        }
        function handleTouchEnd() {
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
                    // Apply color change logic here
                    // For example, change the fill color of the shape
                    shape.style.fill = selectedColor;
                });
            }
        }
    
        // handleTouchMove
        function handleShapeTouchEnter(event) {
            if (isDragging) {
                event.target.setAttribute('data-hovered', 'true');
            }
        }
        function handleShapeTouchLeave(event) {
            event.target.removeAttribute('data-hovered');
        }
        function handleTouchMove(event) {
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
        });
    
    
    // Export SVG Button
    const exportSvgButton = document.getElementById('exportSvgButton');
    exportSvgButton.addEventListener('click', exportSvg);
    
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
    