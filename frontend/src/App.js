import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Auth/Login';
import TodoLists from './components/TodoList/TodoLists';
import TodoListDetail from './components/TodoList/TodoListDetail';
import Header from './components/Layout/Header';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

function PrivateRoute({ component: Component, ...rest }) {
  const { token } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="container mt-4">
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/dashboard" component={TodoLists} />
            <PrivateRoute path="/list/:id" component={TodoListDetail} />
            <Route render={() => <Redirect to="/dashboard" />} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
