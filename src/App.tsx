import { Route, Switch } from 'wouter'
import { AuthProvider } from './lib/auth'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600">Page not found</p>
            </div>
          </div>
        </Route>
      </Switch>
    </AuthProvider>
  )
}

export default App
