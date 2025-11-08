import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import Homepage from "./pages/Homepage.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authslice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel.jsx";
import ProblemPage from "./pages/ProblemPage.jsx"
import Admin from "./pages/Admin.jsx";
import AdminVideo from "./components/AdminVideo.jsx"
import AdminDelete from "./components/AdminDelete.jsx"
import AdminUpload from "./components/AdminUpload.jsx"

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      
    </Routes>
  </>
  )
}

export default App;