import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { useNewCategoryMutation } from "../../../redux/api/categoryAPI";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const NewCategory = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [name, setName] = useState<string>("");
  const [newCategory] = useNewCategoryMutation();
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !user) return;

    const formData = {
      name,
      userId: user._id, // Ensure userId is included
    };

    const res = await newCategory(formData);

    responseToast(res, navigate, "/admin/categories");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="category-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Category</h2>
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
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewCategory;
