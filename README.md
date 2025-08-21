# 3D Grid Maze

A 3D maze generator and explorer built with Three.js, featuring procedurally generated mazes with first-person navigation.

## Features

- **3D Maze Generation**: Procedurally generated mazes using recursive backtracking algorithm
- **First-Person Navigation**: Walk through the maze from a first-person perspective
- **Movement Controls**: 
  - **W** - Walk Forward
  - **S** - Walk Backward  
  - **A** - Turn Left (90 degrees)
  - **D** - Turn Right (90 degrees)
  - **Mouse** - Look around by clicking and dragging
- **Customizable Maze**: Adjust maze size and wall height
- **Real-time Rendering**: Smooth 60 FPS navigation with shadows and lighting
- **Collision Detection**: Walls prevent walking through solid objects

## How to Run

1. Open `index.html` in a modern web browser
2. The maze will automatically generate and load
3. Use the controls to navigate through the maze

## Controls

### Movement
- **W** - Move forward in the direction you're facing
- **S** - Move backward (opposite direction)
- **A** - Rotate 90 degrees left
- **D** - Rotate 90 degrees right

### Camera
- **Mouse Click + Drag** - Look around by rotating the camera
- **Mouse Release** - Stop camera rotation

### UI Controls
- **Maze Size**: Set the dimensions of the maze (5x5 to 20x20)
- **Wall Height**: Adjust the height of maze walls (1.0 to 5.0)
- **Generate New Maze**: Create a new random maze with current settings
- **Reset Position**: Return to the starting position

## Technical Details

### Maze Generation
The maze uses a recursive backtracking algorithm to create a perfect maze (one path between any two points) with the following characteristics:
- Walls are placed on a grid system
- Paths are carved between walls
- Start and end points are guaranteed to be accessible
- No loops or unreachable areas

### 3D Rendering
- Built with Three.js for WebGL rendering
- Dynamic lighting with shadows
- Fog effects for depth perception
- Responsive design that adapts to window resizing

### Performance
- Optimized rendering with frame rate monitoring
- Efficient collision detection
- Smooth movement with delta-time based animation

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Requires WebGL support for 3D rendering.

## File Structure

- `index.html` - Main HTML file with UI controls
- `maze.js` - Core maze logic and Three.js rendering
- `README.md` - This documentation file

## Customization

You can modify the maze generation by editing the following parameters in `maze.js`:
- `mazeSize` - Default maze dimensions
- `wallHeight` - Default wall height
- `moveSpeed` - Player movement speed
- `turnSpeed` - Player rotation speed
- Colors and materials for walls, floor, and lighting

## Future Enhancements

Potential improvements could include:
- Multiple maze themes and textures
- Sound effects and ambient audio
- Mini-map or overhead view
- Multiple difficulty levels
- Save/load maze configurations
- Multiplayer support
