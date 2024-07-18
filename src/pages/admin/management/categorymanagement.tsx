import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDeleteCategoryMutation, useGetCategoryQuery, useUpdateCategoryMutation } from "../../../redux/api/categoryAPI";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";

const CategoryManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const slug = params.slug as string;

  const { data, isLoading, isError } = useGetCategoryQuery(slug);

  const [nameUpdate, setNameUpdate] = useState<string>("");

  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.category || !nameUpdate) return;

    const res = await updateCategory({
      id: data.category._id,
      userId: user?._id as string,  // Ensure userId is a string
      name: nameUpdate,
    });

    responseToast(res, navigate, "/admin/categories");
  };

  const deleteHandler = async () => {
    if (!data?.category) return;

    const res = await deleteCategory({
      id: data.category._id,
      userId: user?._id as string,  // Ensure userId is a string
    });

    responseToast(res, navigate, "/admin/categories");
  };

  useEffect(() => {
    if (data?.category) {
      setNameUpdate(data.category.name);
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
              <strong>ID - {data?.category._id}</strong>
              <p>{nameUpdate}</p>
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
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryManagement;
