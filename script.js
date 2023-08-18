document.addEventListener('DOMContentLoaded', () => {
    const svgFileInput = document.getElementById('svgFileInput');
    const colorPicker = document.getElementById('colorPicker');
    const applyColorButton = document.getElementById('applyColorButton');
    const canvas = document.getElementById('canvas');
  
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
  
    function addColorChangeListeners() {
      const shapes = canvas.querySelectorAll('path, circle, rect'); // Add other SVG shapes as needed
      shapes.forEach((shape) => {
        shape.addEventListener('click', handleShapeClick);
      });
    }
  
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
  });
  