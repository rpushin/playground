class Maze3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.maze = null;
        this.mazeSize = 10;
        this.wallHeight = 2;
        this.player = {
            position: { x: 0, y: 0, z: 0 },
            direction: 0, // 0: North, 1: East, 2: South, 3: West
            rotation: 0
        };
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        this.isMouseDown = false;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        
        this.init();
        this.setupEventListeners();
        this.generateMaze();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0); // Eye level height
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting
        this.setupLighting();
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -25;
        directionalLight.shadow.camera.right = 25;
        directionalLight.shadow.camera.top = 25;
        directionalLight.shadow.camera.bottom = -25;
        this.scene.add(directionalLight);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events
        document.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        document.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                const deltaX = e.clientX - this.mouse.x;
                const deltaY = e.clientY - this.mouse.y;
                
                this.player.rotation -= deltaX * 0.01;
                this.camera.rotation.y = this.player.rotation;
                
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // UI controls
        document.getElementById('generateMaze').addEventListener('click', () => {
            this.mazeSize = parseInt(document.getElementById('mazeSize').value);
            this.wallHeight = parseFloat(document.getElementById('wallHeight').value);
            this.generateMaze();
        });
        
        document.getElementById('resetPosition').addEventListener('click', () => {
            this.resetPlayerPosition();
        });
    }
    
    generateMaze() {
        // Clear existing maze
        if (this.maze) {
            this.scene.remove(this.maze);
        }
        
        this.maze = new THREE.Group();
        
        // Generate maze using recursive backtracking
        const grid = this.generateMazeGrid();
        
        // Create 3D walls
        this.createWalls(grid);
        
        this.scene.add(this.maze);
        
        // Reset player position to start
        this.resetPlayerPosition();
    }
    
    generateMazeGrid() {
        const size = this.mazeSize;
        const grid = Array(size).fill().map(() => Array(size).fill(1)); // 1 = wall, 0 = path
        
        // Start with all walls
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                grid[x][z] = 1;
            }
        }
        
        // Recursive backtracking algorithm
        const stack = [];
        const startX = 1;
        const startZ = 1;
        
        grid[startX][startZ] = 0;
        stack.push([startX, startZ]);
        
        while (stack.length > 0) {
            const [x, z] = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(x, z, grid);
            
            if (neighbors.length === 0) {
                stack.pop();
            } else {
                const [nx, nz] = neighbors[Math.floor(Math.random() * neighbors.length)];
                grid[Math.floor((x + nx) / 2)][Math.floor((z + nz) / 2)] = 0;
                grid[nx][nz] = 0;
                stack.push([nx, nz]);
            }
        }
        
        // Ensure start and end are accessible
        grid[1][1] = 0;
        grid[size - 2][size - 2] = 0;
        
        return grid;
    }
    
    getUnvisitedNeighbors(x, z, grid) {
        const neighbors = [];
        const directions = [
            [x + 2, z],
            [x - 2, z],
            [x, z + 2],
            [x, z - 2]
        ];
        
        for (const [nx, nz] of directions) {
            if (nx > 0 && nx < grid.length - 1 && nz > 0 && nz < grid[0].length - 1 && grid[nx][nz] === 1) {
                neighbors.push([nx, nz]);
            }
        }
        
        return neighbors;
    }
    
    createWalls(grid) {
        const wallGeometry = new THREE.BoxGeometry(1, this.wallHeight, 1);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
        
        for (let x = 0; x < grid.length; x++) {
            for (let z = 0; z < grid[0].length; z++) {
                if (grid[x][z] === 1) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x - this.mazeSize / 2, this.wallHeight / 2, z - this.mazeSize / 2);
                    wall.castShadow = true;
                    wall.receiveShadow = true;
                    this.maze.add(wall);
                }
            }
        }
        
        // Add floor
        const floorGeometry = new THREE.PlaneGeometry(this.mazeSize, this.mazeSize);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.maze.add(floor);
    }
    
    resetPlayerPosition() {
        this.player.position = { x: 0, y: 0, z: 0 };
        this.player.direction = 0;
        this.player.rotation = 0;
        this.camera.position.set(0, 1.6, 0);
        this.camera.rotation.set(0, 0, 0);
        this.updateUI();
    }
    
    handleMovement(deltaTime) {
        const moveSpeed = 5 * deltaTime;
        const turnSpeed = 2 * deltaTime;
        
        // Forward/Backward movement
        if (this.keys['KeyW']) {
            this.moveForward(moveSpeed);
        }
        if (this.keys['KeyS']) {
            this.moveForward(-moveSpeed);
        }
        
        // Left/Right turning
        if (this.keys['KeyA']) {
            this.turnLeft(turnSpeed);
        }
        if (this.keys['KeyD']) {
            this.turnRight(turnSpeed);
        }
        
        // Update camera position
        this.camera.position.x = this.player.position.x;
        this.camera.position.z = this.player.position.z;
        this.camera.rotation.y = this.player.rotation;
    }
    
    moveForward(distance) {
        const newX = this.player.position.x + Math.sin(this.player.rotation) * distance;
        const newZ = this.player.position.z + Math.cos(this.player.rotation) * distance;
        
        // Check collision with walls
        if (!this.checkCollision(newX, newZ)) {
            this.player.position.x = newX;
            this.player.position.z = newZ;
        }
        
        this.updateUI();
    }
    
    turnLeft(angle) {
        this.player.rotation += angle;
        this.player.direction = (this.player.direction + 3) % 4; // Turn left (counter-clockwise)
        this.updateUI();
    }
    
    turnRight(angle) {
        this.player.rotation -= angle;
        this.player.direction = (this.player.direction + 1) % 4; // Turn right (clockwise)
        this.updateUI();
    }
    
    checkCollision(x, z) {
        // Convert world coordinates to grid coordinates
        const gridX = Math.floor(x + this.mazeSize / 2);
        const gridZ = Math.floor(z + this.mazeSize / 2);
        
        // Check bounds
        if (gridX < 0 || gridX >= this.mazeSize || gridZ < 0 || gridZ >= this.mazeSize) {
            return true; // Collision with boundary
        }
        
        // Check if position is inside a wall (simplified collision detection)
        const margin = 0.3; // Player collision margin
        const checkPoints = [
            [x + margin, z + margin],
            [x + margin, z - margin],
            [x - margin, z + margin],
            [x - margin, z - margin]
        ];
        
        for (const [checkX, checkZ] of checkPoints) {
            const checkGridX = Math.floor(checkX + this.mazeSize / 2);
            const checkGridZ = Math.floor(checkZ + this.mazeSize / 2);
            
            if (checkGridX >= 0 && checkGridX < this.mazeSize && 
                checkGridZ >= 0 && checkGridZ < this.mazeSize) {
                // This would need to check against the actual maze grid
                // For now, we'll use a simple boundary check
                if (Math.abs(checkX) > this.mazeSize / 2 - 0.5 || 
                    Math.abs(checkZ) > this.mazeSize / 2 - 0.5) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    updateUI() {
        const directionNames = ['North', 'East', 'South', 'West'];
        document.getElementById('position').textContent = 
            `(${this.player.position.x.toFixed(1)}, ${this.player.position.y.toFixed(1)}, ${this.player.position.z.toFixed(1)})`;
        document.getElementById('direction').textContent = directionNames[this.player.direction];
    }
    
    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            document.getElementById('fps').textContent = this.fps;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.handleMovement(deltaTime);
        this.updateFPS();
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the maze when the page loads
window.addEventListener('load', () => {
    new Maze3D();
});