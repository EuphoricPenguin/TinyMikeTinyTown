document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('map-canvas');
    const ctx = canvas.getContext('2d');
    
    // Pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    let mapData, tilesetImg;
    let scale = 1;

    async function init() {
        try {
            // Load map data
            const response = await fetch('/api/map');
            mapData = await response.json();
            
            // Load tileset image
            tilesetImg = new Image();
            tilesetImg.src = '/roguelikeSheet_transparent.png';
            await new Promise((resolve) => { tilesetImg.onload = resolve; });
            
            setupCanvas();
            renderMap();
            
            window.addEventListener('resize', () => {
                setupCanvas();
                renderMap();
            });
            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function setupCanvas() {
        // Calculate base pixel dimensions
        const mapWidthPx = mapData.width * mapData.tilewidth;
        const mapHeightPx = mapData.height * mapData.tileheight;
        
        // Calculate maximum integer scale
        scale = Math.max(1, Math.min(
            Math.floor(window.innerWidth / mapWidthPx),
            Math.floor(window.innerHeight / mapHeightPx)
        ));
        
        // Set canvas to exact size (CSS handles scaling)
        canvas.width = mapWidthPx;
        canvas.height = mapHeightPx;
        canvas.style.width = `${mapWidthPx * scale}px`;
        canvas.style.height = `${mapHeightPx * scale}px`;
    }

    function renderMap() {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Tileset parameters
        const tileWidth = mapData.tilewidth;
        const tileHeight = mapData.tileheight;
        const tilesetSpacing = 1;
        const tilesetMargin = 0;
        
        // Calculate tileset layout
        const tilesPerRow = Math.floor(
            (tilesetImg.width - tilesetMargin * 2 + tilesetSpacing) / 
            (tileWidth + tilesetSpacing)
        );
        
        // Render layers
        mapData.layers.forEach(layer => {
            if (layer.type === 'tilelayer' && layer.visible) {
                for (let y = 0; y < mapData.height; y++) {
                    for (let x = 0; x < mapData.width; x++) {
                        const tileId = layer.data[y * mapData.width + x];
                        if (tileId > 0) {
                            const tileNum = tileId - 1;
                            const srcX = tilesetMargin + (tileNum % tilesPerRow) * (tileWidth + tilesetSpacing);
                            const srcY = tilesetMargin + Math.floor(tileNum / tilesPerRow) * (tileHeight + tilesetSpacing);
                            
                            ctx.drawImage(
                                tilesetImg,
                                srcX, srcY, tileWidth, tileHeight,
                                x * tileWidth, y * tileHeight, tileWidth, tileHeight
                            );
                        }
                    }
                }
            }
        });
    }

    init();
});