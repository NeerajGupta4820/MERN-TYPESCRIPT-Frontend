import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState, server } from "../../../redux/store";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryAPI";

const ProductManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const [priceUpdate, setPriceUpdate] = useState<number | undefined>(undefined);
  const [stockUpdate, setStockUpdate] = useState<number | undefined>(undefined);
  const [nameUpdate, setNameUpdate] = useState<string>("");
  const [categoryUpdate, setCategoryUpdate] = useState<string>("");
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>("");
  const [photoPrevs, setPhotoPrevs] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();

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

    if (!data?.product || !nameUpdate || priceUpdate === undefined || !categoryUpdate || !descriptionUpdate) return;

    const formData = new FormData();

    formData.set("name", nameUpdate);
    formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined) formData.set("stock", stockUpdate.toString());
    formData.set("category", categoryUpdate);
    formData.set("description", descriptionUpdate);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data.product._id,
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteHandler = async () => {
    if (!data?.product) return;

    const res = await deleteProduct({
      userId: user?._id!,
      productId: data.product._id,
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data?.product) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setDescriptionUpdate(data.product.description);
      if (Array.isArray(data.product.photos)) {
        setPhotoPrevs(data.product.photos.map((photo: string) => `${server}/${photo}`));
      }
    }
  }, [data]);

  if (isError) return <Navigate to="/404" />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              {photoPrevs.map((photo, index) => (
                <img key={index} src={photo} alt={`Product ${index}`} />
              ))}
              <p>{nameUpdate}</p>
              {stockUpdate !== undefined && stockUpdate > 0 ? (
                <span className="green">{stockUpdate} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{priceUpdate}</h3>
              <p>{descriptionUpdate}</p>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate ?? ""}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate ?? ""}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Category</label>
                  {categoriesLoading ? (
                    <p>Loading categories...</p>
                  ) : (
                    <select
                      value={categoryUpdate}
                      onChange={(e) => setCategoryUpdate(e.target.value)}
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
                    placeholder="Product description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label>Photos</label>
                  <input type="file" multiple onChange={changeImageHandler} />
                </div>

                {photoPrevs.length > 0 && (
                  <div className="photo-previews">
                    {photoPrevs.map((photo, index) => (
                      <img key={index} src={photo} alt={`New Image ${index}`} />
                    ))}
                  </div>
                )}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
