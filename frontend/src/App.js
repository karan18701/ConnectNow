import { Route } from "react-router-dom";
import "./App.css";
import ChatPages from "./Pages/ChatPages";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact></Route>
      <Route path="/chats" component={ChatPages}></Route>
    </div>
  );
}

export default App;

// without writing await while fetching data it will return promise not actual data
// without writing async and use await will give error
