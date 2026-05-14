import React from "react";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./components/Home";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" component={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
