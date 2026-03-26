import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Homepage from './pages/Homepage.jsx';
import LostItems from './pages/LostItems.jsx';
import FoundItems from './pages/FoundItems.jsx';
import ReportLost from './pages/ReportLost.jsx';
import ReportFound from './pages/ReportFound.jsx';
import ChatPage from './pages/ChatPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProfileEdit from './pages/ProfileEdit.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import UserDetails from './pages/UserDetails.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminItems from './pages/admin/AdminItems.jsx';
import AdminLocations from './pages/admin/AdminLocations.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore.js';
import { useChatStore } from './store/chatStore.js';
import { useEffect } from 'react';
import InstallPrompt from './components/InstallPrompt.jsx';

const UserRoute = ({ children }) => {
    const { authUser } = useAuthStore();
    if (!authUser) return <Navigate to="/login" />;
    if (authUser.role === 'admin') return <Navigate to="/admin" />;
    return children;
};

const AdminRoute = ({ children }) => {
    const { authUser } = useAuthStore();
    if (!authUser) return <Navigate to="/login" />;
    if (authUser.role !== 'admin') return <Navigate to="/home" />;
    return children;
};

function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const { getRecentChats } = useChatStore();

    useEffect(() => { checkAuth(); }, [checkAuth]);
    useEffect(() => { if (authUser) getRecentChats(); }, [authUser]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const getRedirectPath = () => authUser?.role === 'admin' ? '/admin' : '/home';

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path='/register' element={!authUser ? <Register /> : <Navigate to={getRedirectPath()} />} />
                    <Route path='/login' element={!authUser ? <Login /> : <Navigate to={getRedirectPath()} />} />
                    <Route path='/forgot-password' element={!authUser ? <ForgotPassword /> : <Navigate to={getRedirectPath()} />} />
                    <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to={getRedirectPath()} />} />
                    <Route path='/verify-email' element={<VerifyEmail />} />

                    {/* User-only routes */}
                    <Route path='/home' element={<UserRoute><Homepage /></UserRoute>} />
                    <Route path='/lost' element={<UserRoute><LostItems /></UserRoute>} />
                    <Route path='/found' element={<UserRoute><FoundItems /></UserRoute>} />
                    <Route path='/report-lost' element={<UserRoute><ReportLost /></UserRoute>} />
                    <Route path='/report-found' element={<UserRoute><ReportFound /></UserRoute>} />
                    <Route path='/chat' element={<UserRoute><ChatPage /></UserRoute>} />
                    <Route path='/search' element={<UserRoute><SearchPage /></UserRoute>} />
                    <Route path='/profile' element={<UserRoute><ProfilePage /></UserRoute>} />
                    <Route path='/profile-edit' element={<UserRoute><ProfileEdit /></UserRoute>} />
                    <Route path='/item/:id' element={<UserRoute><ItemDetails /></UserRoute>} />
                    <Route path='/user/:id' element={<UserRoute><UserDetails /></UserRoute>} />
                    <Route path='/reviews' element={<UserRoute><ReviewsPage /></UserRoute>} />

                    {/* Admin-only routes */}
                    <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path='/admin/users' element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path='/admin/users/:userId' element={<AdminRoute><AdminItems /></AdminRoute>} />
                    <Route path='/admin/items' element={<AdminRoute><AdminItems /></AdminRoute>} />
                    <Route path='/admin/locations' element={<AdminRoute><AdminLocations /></AdminRoute>} />
                    <Route path='/admin/categories' element={<AdminRoute><AdminCategories /></AdminRoute>} />

                    <Route path='*' element={<Navigate to={authUser ? getRedirectPath() : '/login'} />} />
                </Routes>
                <Toaster />
            </BrowserRouter>
            <InstallPrompt />
        </>
    );
}

export default App;
