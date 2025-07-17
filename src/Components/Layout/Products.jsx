import React, { useEffect, useState } from "react";
import "./Product.css";
import { onAuthStateChanged } from "firebase/auth";
import { useBag } from "../../context/BagContext";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useFavourites } from "../../context/FavouritesContext";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Products = ({ search }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const { addToBag } = useBag();

  const toggleFavourites = (product) => {
    const isFaved = favourites.some(item => item.id === product.id);
    if (isFaved) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product);
    }
  };

  const handleAddToBag = (product) => {
    addToBag(product);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // fetch api
        const response = await fetch("https://fakestoreapi.in/api/products");
        const apiData = await response.json();
        console.log(apiData);
        const apiProducts = (apiData.products || []).map((p) => ({
          ...p,
          source: "api"
        }));

        // fetch from firestore
        const snapshot = await getDocs(collection(db, "products"));
        const fireStoreProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // combine both
        setProducts([...apiProducts, ...fireStoreProducts]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesSearch = search === '' || product.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", ...new Set(products.map(p => p.category))];

  console.log("Search value in Products:", search);
  if (loading) return <p>Loading Products...</p>

  const handleSort = (e) => {
    setSortOption(e.target.value);
  }

  const getSortedProducts = () => {
    const sorted = [...filteredProducts];
    if (sortOption === "priceLowHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
      sorted.sort((a, b) => b.price - a.price);
    }
    else if (sortOption === "ratingHighLow") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "titleAZ") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "titleZA") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }
    return sorted;
  };

  return (
    <div className="product-view">
      <h2>Products</h2>

      <div className="filter-bar">
        <label>Filter by Category: </label>
        <select onChange={(e) => setFilterCategory(e.target.value)}
          value={filterCategory}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="sort-bar">
        <label>Sort By: </label>
        <select onChange={handleSort} value={sortOption}>
          <option value="">Default</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
          <option value="titleAZ">Title: A to Z</option>
          <option value="titleZA">Title: Z to A</option>
        </select>
      </div>

      <div className="product-grid">
        {getSortedProducts().map((product) => {
          const prefix = product.source === "firestore" ? "fs-" : "api-";
          return (
            <div key={prefix + product.id} className="product-card">
              <Link to={`/product/${prefix}${product.id}`}
                className="product-link">
                <img src={product.image} alt={product.title} />
                <h4>{product.title}</h4>
                <p>${product.price}</p>
              </Link>
              <button className="add-btn" onClick={() => handleAddToBag(product)}>
                Add to Cart
              </button>
              <button className="fav-btn" onClick={() => toggleFavourites(product)}>
                {favourites.some(fav => fav.id === product.id) ?
                  <FcLike /> : <FcLikePlaceholder />}
              </button>
            </div>
          )
        }
        )};
      </div>
    </div>
  );
};

export default Products;
