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

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path='/register' element={!authUser ? <Register /> : <Navigate to='/home' />} />
                    <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/home' />} />
                    <Route path='/forgot-password' element={!authUser ? <ForgotPassword /> : <Navigate to='/home' />} />
                    <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to='/home' />} />
                    <Route path='/verify-email' element={<VerifyEmail />} />

                    {/* Protected — users */}
                    <Route path='/home' element={authUser ? <Homepage /> : <Navigate to='/login' />} />
                    <Route path='/lost' element={authUser ? <LostItems /> : <Navigate to='/login' />} />
                    <Route path='/found' element={authUser ? <FoundItems /> : <Navigate to='/login' />} />
                    <Route path='/report-lost' element={authUser ? <ReportLost /> : <Navigate to='/login' />} />
                    <Route path='/report-found' element={authUser ? <ReportFound /> : <Navigate to='/login' />} />
                    <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to='/login' />} />
                    <Route path='/search' element={authUser ? <SearchPage /> : <Navigate to='/login' />} />
                    <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
                    <Route path='/profile-edit' element={authUser ? <ProfileEdit /> : <Navigate to='/login' />} />
                    <Route path='/item/:id' element={authUser ? <ItemDetails /> : <Navigate to='/login' />} />
                    <Route path='/user/:id' element={authUser ? <UserDetails /> : <Navigate to='/login' />} />
                    <Route path='/reviews' element={authUser ? <ReviewsPage /> : <Navigate to='/login' />} />

                    {/* Admin-only */}
                    <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path='/admin/users' element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path='/admin/users/:userId' element={<AdminRoute><AdminItems /></AdminRoute>} />
                    <Route path='/admin/items' element={<AdminRoute><AdminItems /></AdminRoute>} />
                    <Route path='/admin/locations' element={<AdminRoute><AdminLocations /></AdminRoute>} />
                    <Route path='/admin/categories' element={<AdminRoute><AdminCategories /></AdminRoute>} />

                    <Route path='*' element={<Navigate to={authUser ? '/home' : '/login'} />} />
                </Routes>
                <Toaster />
            </BrowserRouter>
            <InstallPrompt />
        </>
    );
}

export default App;
