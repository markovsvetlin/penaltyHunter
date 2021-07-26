import "./App.css";

import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [isPenalty, setIsPenalty] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!url) {
      return alert("Enter URL");
    } else {
      setIsLoading(true);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          setIsPenalty(data.penalty);
          setUrl("");
        });
    }
  };

  return (
    <div className="site-container">
      <h1 className="Logo">Penalty hunter</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          onChange={(e) => setUrl(e.target.value)}
          name="test"
          className="url-input"
        />
        <input className="submit-button" type="submit" />
      </form>
      {url == "" ? <h1>Enter URL</h1> : isLoading && <h1>Checking the page</h1>}

      {isPenalty != undefined && isPenalty && (
        <h1>The URL has 2-click penalty</h1>
      )}
      {isPenalty != undefined && !isPenalty && (
        <h1>The URL has NOT 2-click penalty</h1>
      )}
    </div>
  );
}

export default App;
