import { useState } from 'react';
import './App.css';

function App() {
  const [circles, setCircles] = useState([]);
  const [undoCircles, setUndoCircles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cirleDiameter, setCircleDiametre] = useState(50);
  const [selectedCircleCoordinates, setSelectedCircleCoordinates] = useState({
    x: 0,
    y: 0,
    index: 0,
  });
  const circleRadius = 25;

  const handleCircleClick = (event) => {
    const { target, offsetX, offsetY } = event.nativeEvent;
    if (target.classList.contains('circle')) {
      event.stopPropagation();
      return;
    }
    const isInsideCircle = circles.some((circle) => {
      const distance = Math.sqrt(
        (circle.x - offsetX) ** 2 + (circle.y - offsetY) ** 2
      );

      return distance <= circleRadius;
    });
    if (isInsideCircle) {
      return;
    }
    const newCircle = { x: offsetX, y: offsetY, diameter: cirleDiameter };
    setCircles([...circles, newCircle]);
    setUndoCircles([]);
  };

  const handleUndoBtn = () => {
    if (circles.length > 0) {
      const lastCircle = circles[circles.length - 1];
      const updatedCircles = circles.slice(0, -1);
      setUndoCircles([...undoCircles, lastCircle]);
      setCircles(updatedCircles);
    }
  };

  const handleRedoBtn = () => {
    if (undoCircles.length > 0) {
      const lastUndoneCircle = undoCircles[undoCircles.length - 1];
      const updateUndoCircles = undoCircles.slice(0, -1);
      setCircles([...circles, lastUndoneCircle]);
      setUndoCircles(updateUndoCircles);
    }
  };

  const openModal = (offsetX, offsetY, index) => {
    setSelectedCircleCoordinates({
      x: offsetX,
      y: offsetY,
      index: index,
    });
    setCircleDiametre(circleRadius * 2);
    // console.log(offsetX);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleDiameterChange = (event) => {
    const diameter = parseInt(event.target.value);
    setCircleDiametre(diameter);
    circles[selectedCircleCoordinates.index].diameter = diameter;
  };
  return (
    <>
      <div className="circle-body">
        <div className="circle-head">
          <h3>CircleDraw</h3>
        </div>
        <div className="circle-buttons">
          <button onClick={handleUndoBtn}>Undo</button>
          <button onClick={handleRedoBtn}>Redo</button>
        </div>
        <div className="circle-container" onClick={handleCircleClick}>
          <div className="circle-content">
            {circles.map((circle, index) => (
              <div
                key={index}
                className="circle"
                style={{
                  left: circle.x,
                  top: circle.y,
                  width: `${circle.diameter}px`,
                  height: `${circle.diameter}px`,
                }}
                onDoubleClick={(event) =>
                  openModal(
                    event.nativeEvent.offsetX,
                    event.nativeEvent.offsetY,
                    index
                  )
                }
              ></div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="modal"
          style={{
            top: selectedCircleCoordinates.y + 25,
            left: selectedCircleCoordinates.x + 25,
          }}
        >
          <div className="modal-content">
            <p>Adjust diameter of circle</p>
            <input
              type="range"
              min="10"
              max="100"
              value={cirleDiameter}
              onChange={handleDiameterChange}
            />
            <button onClick={closeModal}>Close Modal</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
