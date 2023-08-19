// Ensures JS only loads *after* HTML
document.addEventListener('DOMContentLoaded', () => {

// Referencing Elements in the DOM
    const svgFileInput = document.getElementById('svgFileInput');
    const colorPicker = document.getElementById('colorPicker');
    const applyColorButton = document.getElementById('applyColorButton');
    const canvas = document.getElementById('canvas');

// Event Listener for File Input
    svgFileInput.addEventListener('change', handleFileInput);
  
    function handleFileInput(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const svgContent = e.target.result;
          canvas.innerHTML = svgContent;
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
        if (shape.style.fill = 'none') {
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

  });
  