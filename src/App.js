import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import "./App.css";
import Menu from "./components/Menu";
import { AuthContextProvider } from "./context/auth";
import Home from "./pages/home";
import Login from "./pages/login";
import PostPage from "./pages/post";
import Signup from "./pages/signup";

// TODO implement light/dark theme
// TODO some kinda profile page

function App() {
  return (
    <Container>
      <BrowserRouter>
        <AuthContextProvider>
          <Menu />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" component={Home} />
          <Route exact path="/post/:postId" component={PostPage} />
        </AuthContextProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;
