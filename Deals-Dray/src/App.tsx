import { Route, Routes } from "react-router-dom"
import Login from "./components/pages/Login"
import Dashboard from "./components/pages/Dashboard"
import Navbar from "./components/common/Navbar"
import AddEmployee from "./components/pages/AddEmployee"
import EmployeeList from "./components/pages/EmployeeList"
import EditEmployee from "./components/pages/EditEmployee"
import Home from "./components/pages/Home"
import PrivateRoute from "./components/common/PrivateRoutes"

function App() {

  return (
    <>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard"
          element={<PrivateRoute>
            <Dashboard />
          </PrivateRoute>} />

        <Route path="/create-employee"
          element={<PrivateRoute>
            <AddEmployee />
          </PrivateRoute>} />

        <Route path="/employee-list" element={
          <PrivateRoute>
            <EmployeeList />
          </PrivateRoute>
        } />

        <Route path="/edit-employee/:id" element={
          <PrivateRoute>
            <EditEmployee />
          </PrivateRoute>} />

      </Routes>
    </>
  )
}

export default App
