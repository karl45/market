import { useEffect, useRef, useState } from "react";
import "./Products.scss";
import { useNavigate } from "react-router-dom";
import { createOrderApiClient } from "../../apiHelper/OrderApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";

type ProductType = {
  id: string | null;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imageBytes: string | null;
};

interface ProductProps extends AuthProps {}

function Product({ auth }: ProductProps) {
  const initialProduct: ProductType = {
    id: null,
    name: "",
    quantity: 0,
    price: 0,
    imageUrl: "",
    imageBytes: "",
  };
  const [products, setProducts] = useState<ProductType[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [addRotated, setAddRotated] = useState<boolean>(false);
  const [addProduct, setAddProduct] = useState<ProductType>(initialProduct);

  const api = createOrderApiClient(auth);

  async function fetchProducts() {
    const productsRes = await api.get("/product");
    const product_data = await productsRes.json();
    setProducts(product_data.products);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const onAddProduct = () => {
    async function fetchAddProducts() {
      try {
        const productsRes = await api.post("/product", addProduct);
        if (!productsRes.ok) {
          console.error("Product adding error.");
          return;
        } else {
          fetchProducts();
          setAddProduct(initialProduct);
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
        }
      } catch (e) {
        console.error("Failed to fetch JWT token:", e);
      }
    }
    fetchAddProducts();
  };

  const onDeleteProduct = (id: string | null) => {
    async function fetchDeleteProducts() {
      try {
        const productsRes = await api.delete(`/product/${id}`);

        if (!productsRes.ok) {
          console.error("Product adding error.");
          return;
        } else {
          fetchProducts();
        }
      } catch (e) {
        console.error("Failed to fetch JWT token:", e);
      }
    }
    fetchDeleteProducts();
  };

  const onShowAddForm = () => {
    setAddRotated((prev) => !prev);
  };

  const OnChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddProduct((prev) => ({
      ...prev,
      quantity: Number(e.target.value),
    }));
  };

  const OnChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddProduct((prev) => ({
      ...prev,
      price: Number(e.target.value),
    }));
  };

  const OnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddProduct((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const OnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1]; // убираем префикс data:image/...
        setAddProduct((prev) => ({
          ...prev,
          imageBytes: base64,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="product_wrapper">
      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.id}>
            <div className="quantity">
              <span>{product.quantity} шт.</span>
            </div>

            <div className="img_card">
              <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className="info">
              <div className="title">
                <span>{product.name}</span>
              </div>
              <div className="price">
                <span>{product.price}$</span>
              </div>
            </div>

            <button
              onClick={() => onDeleteProduct(product.id)}
              className="delete_button"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <button onClick={onShowAddForm} className="add_button">
          <div className="button_text">
            <span>Добавить продукт</span>
          </div>
          <div className={`up_wrapper${addRotated ? " rotated" : ""}`}>
            <img src="https://www.vhv.rs/dpng/d/415-4154018_arrow-png-svg-up-arrow-icon-transparent-png.png" />
          </div>
        </button>
        {addRotated && (
          <div className="add_product_form">
            <div className="input_name">
              <span>Name : </span>
              <input
                value={addProduct.name}
                onChange={(e) => OnChangeName(e)}
              />
            </div>
            <div className="input_quantity">
              <span>Quantity : </span>
              <input
                value={addProduct.quantity}
                onChange={(e) => OnChangeQuantity(e)}
                type="number"
              />
            </div>
            <div className="input_price">
              <span>Price : </span>
              <input
                value={addProduct.price}
                onChange={(e) => OnChangePrice(e)}
                type="number"
              />
            </div>
            <div className="input_image">
              <span>Image : </span>
              <input
                ref={imageInputRef}
                onChange={(e) => OnChangeImage(e)}
                type="file"
                accept="image/*"
              />
            </div>
            <button onClick={onAddProduct}>Добавить</button>
          </div>
        )}
    </div>
  );
}

export default Product;
