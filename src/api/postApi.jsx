import axios from "axios";

const api = axios.create({
    baseURL: "https://fakestoreapi.com/products",
});

console.log(api);

//http get method
export const getProductsData = () => {
return axios.get('https://fakestoreapi.com/products')
  .then(response => console.log(response.data));
}
  
export const product = { title: 'New Product', price: 29.99 };
axios.post('https://fakestoreapi.com/products', product)
  .then(response => console.log(response.data));