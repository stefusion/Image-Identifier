import * as mobilenet from "@tensorflow-models/mobilenet";
import { useState, useEffect, useRef } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(true); // Set to true initially
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);


  const imageRef = useRef();

  const textInputRef = useRef();

  const loadModel = async () => {
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false); // Set to false once the model is loaded
    } catch (error) {
      console.log("Error loading the model:", error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      console.log(url);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const identify = async () => {
    textInputRef.current.value = '';
    if (model) {
      try {
        const results = await model.classify(imageRef.current);
        console.log(results);
        setResults(results);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h2>Model is Loading...</h2>;
  }

  console.log(imageUrl);
  console.log(results);

  return (
    <div className="App">
      <h1 className="header">Image Identifier</h1>
      <div className="inputHolder">
        <input
          type="file"
          accept="image/*"
          capture="camera"
          className="uploadInput"
          onChange={uploadImage}
        />
        <span className="or">OR</span>
        <input
          type="text"
          placeholder="paste image url"
          ref={textInputRef}
          onChange={handleOnChange}
        />
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Upload preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
          {results.length > 0 && (
            <div className="resultsHolder">
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="confidence">
                      Confidence level: {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Best Guess</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {imageUrl && (
          <button className="button" onClick={identify}>
            Identify Image
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
