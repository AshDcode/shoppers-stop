import { useEffect, useState } from 'react';
import "./Header.css";
import { BsHandbag } from 'react-icons/bs';
import { CiSearch } from "react-icons/ci";
import { FcLikePlaceholder } from "react-icons/fc";
import { SiGnome } from 'react-icons/si';
import Auth from '../Pages/Auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import BagModal from '../Pages/BagModal';
import { useNavigate } from 'react-router-dom';
import FavouriteModal from '../Pages/FavouriteModal';
import { useBag } from '../../context/BagContext';
import { useFavourites } from '../../context/FavouritesContext';
import UpdateProfileModal from '../Pages/UpdateProfileModal';

export default function Header({ name, setName, search, setSearch }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [BagModalOpen, setBagModalOpen] = useState(false);
    const [favouritesOpen, setFavouritesOpen] = useState(false);

    const navigate = useNavigate();

    // const handleSearch = (product) => {
    //     if (search) {
    //         return product.title.toLowerCase().includes(search.toLowerCase());
    //     }
    //     return search;
    // }
    const { bagItems } = useBag();
    const { clearBag } = useBag();
    const { clearFavourites } = useFavourites();
    const totalItems = (bagItems || []).reduce((acc, item) => acc + item.quantity, 0);

    const updateName = (newName) => {
        setName(newName);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setName(currentUser.displayName || currentUser.email);
            } else {
                setName('');
            }
        });
        return () => unsubscribe();
    }, [setName]);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        setName('');
        setShowDropdown(false);
        clearBag();
        clearFavourites();
        navigate('/');
    };

    const handleCheckout = () => {
        setBagModalOpen(false);
        navigate("/payment");
    }
    return (
        <div className='header'>
            <div className='header-logo'>

                <h1>Shoppers stop</h1>
            </div>

            <div className='header-search'>
                <CiSearch />
                <input
                    className='search'
                    type='text'
                    placeholder='What are you looking for?'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className='header-actions'>
                <h3 onClick={() => setFavouritesOpen(true)}><FcLikePlaceholder /></h3>
                <h3 onClick={() => setBagModalOpen(true)}>
                    <BsHandbag />
                    {totalItems > 0 && (
                        <span className='cart-badge'>{totalItems}</span>
                    )}
                </h3>

                {user ? (
                    <>
                        <div className='user-dropdown'>
                            <img className="profile-picture" src={user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"} alt="Profile" />
                            <span className='userName'
                                onClick={() => {
                                    setShowDropdown(!showDropdown);
                                    console.log("Dropdown toggled:", !showDropdown);
                                }}>

                                Welcome, {name.split('@')[0]}
                            </span>
                            {showDropdown && (
                                <div className='dropdown-menu'>
                                    <span
                                        onClick={() => setShowProfileModal(true)}>Update Profile</span>
                                    <button
                                        onClick={handleLogout}
                                        className='logout-btn'>
                                        LogOut
                                    </button>
                                </div>
                            )}
                            <UpdateProfileModal
                                show={showProfileModal}
                                onClose={() => setShowProfileModal(false)}
                                user={user}
                                updateName={updateName}
                            />
                        </div>

                    </>
                ) : (
                    <button onClick={() => setModalOpen(true)}>
                        <SiGnome />
                        <span>Login</span>
                    </button>
                )}
            </div>

            {/* modal for login and signup */}
            <Auth
                shouldShow={modalOpen}
                handleShow={setModalOpen}
                setName={setName}
            />

            {BagModalOpen && (
                <BagModal
                    bagItems={bagItems}
                    onClose={() => setBagModalOpen(false)}
                    onCheckout={handleCheckout}
                />
            )}

            {favouritesOpen && (
                <FavouriteModal
                    onClose={() => setFavouritesOpen(false)}
                />
            )}

        </div >

    );
}
