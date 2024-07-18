import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { useNewProductsMutation } from "../../../redux/api/productAPI";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryAPI";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [discount, setDiscount] = useState<number | undefined>();
  const [photoPrevs, setPhotoPrevs] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const [newProduct] = useNewProductsMutation();
  const navigate = useNavigate();

  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useGetAllCategoriesQuery();

  useEffect(() => {
    if (categoriesError) {
      responseToast({ error: new Error("Cannot Fetch Categories")  }, navigate, "/admin/product");
    }
  }, [categoriesError, navigate]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setPhotos(fileArray);

    const fileReaders = fileArray.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    const promises = fileReaders.map((reader) => {
      return new Promise<string>((resolve) => {
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          }
        };
      });
    });

    Promise.all(promises).then((results) => {
      setPhotoPrevs(results);
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !price || stock < 0 || !category || !photos.length || !description || !brand || !user) return;

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("category", category);
    formData.append("description", description);
    formData.set("brand", brand);

    if (discount !== undefined) {
      formData.set("discount", discount.toString());
    }

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const res = await newProduct({ id: user._id, formData });

    responseToast(res, navigate, "/admin/product");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-managements">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                required
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                required
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              {categoriesLoading ? (
                <p>Loading categories...</p>
              ) : (
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categoriesData?.categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label>Brand</label>
              <input
                type="text"
                required
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label>Discount</label>
              <input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Photos</label>
              <input type="file" multiple required onChange={changeImageHandler} />
            </div>

            {photoPrevs.length > 0 && (
              <div className="photo-previews" >
                {photoPrevs.map((photo, index) => (
                  <img key={index} src={photo} alt={`Preview ${index}`} />
                ))}
              </div>
            )}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
