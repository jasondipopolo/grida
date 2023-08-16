
const gridContainer = document.querySelector('.grid-container');

// Create the grid dynamically
for (let i = 0; i < 100; i++) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.addEventListener('click', fillSquare);
    gridContainer.appendChild(gridItem);
}

// Initialize an array to store SVG data
const svgDataArray = [];

// Function to get the position of the clicked square
function getGridPosition(square) {
    const gridItems = document.querySelectorAll('.grid-item');
    const index = Array.from(gridItems).indexOf(square);
    const row = Math.floor(index / 10); // Assuming 10 columns in the grid
    const col = index % 10;
    return { x: col * 50, y: row * 50 }; // Assuming 50px square size
}

// Function to create SVG data for a square with position information
function createSvgData(position) {
    // Create your SVG content here
    // ...

    // Include the position information as attributes or comments in the SVG data
    return `
    <svg x="${position.x}" y="${position.y}">
    <!-- Your SVG content -->
    <rect width="50" height="50" fill="blue"/>
    </svg>
    `;
}

// Function to fill a square with an SVG
function fillSquare(event) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'blue');
    svg.appendChild(rect);
    event.target.innerHTML = ''; // Clear existing content
    event.target.appendChild(svg);

    const squarePosition = getGridPosition(event.target);
    const svgData = createSvgData(squarePosition);
    svgDataArray.push(svgData); // Store the SVG data in the array
}

// Function to export SVG
function exportSVG() {
    const combinedSVG = `
    <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    ${svgDataArray.join('\n')}
    </svg>`;

    const blob = new Blob([combinedSVG], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'exported-squares.svg'); // Using the FileSaver.js function
}

// Attach click event to export button
document.getElementById('export-button').addEventListener('click', exportSVG);
