import { createContext, useContext, useEffect, useState } from "react";

const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
    const [favourites, setfavourites] = useState(() => {
        const storedFaves = localStorage.getItem("favourites");
        return storedFaves ? JSON.parse(storedFaves) : [];
    });

    const addToFavourites = (product) => {
        setfavourites((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) return prev; //Avoid duplicates
            return [...prev, product];
        });
    };

    const removeFromFavourites = (id) => {
        setfavourites((prev) => prev.filter((item) => item.id !== id));
    };

    const clearFavourites = () => {
        setfavourites([]);
        localStorage.removeItem('favourites');
    };

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

    return (
        <FavouritesContext.Provider
            value={{ favourites, addToFavourites, clearFavourites, removeFromFavourites }}
        >
            {children}
        </FavouritesContext.Provider>
    );
};