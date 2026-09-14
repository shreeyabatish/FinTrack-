import React from "react";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";

function App() {
  return (
    <div className="App">
      <h1>Finance Tracker</h1>
      <Budgets />
      <Goals />
    </div>
  );
}

export default App;
