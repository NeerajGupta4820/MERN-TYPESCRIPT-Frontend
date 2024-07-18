import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryAPI";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/loader";

interface DataType {
  name: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Categories = () => {
  // const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);

  const { isLoading, isError, error, data } = useGetAllCategoriesQuery();
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.categories.map((i) => ({
          name: i.name,
          action: <Link to={`/admin/category/${i.slug}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-category-box",
    "Categories",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div>
        <Link to="/admin/category/new" className="create-category-btn">
          <FaPlus />
        </Link>
        <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      </div>
    </div>
  );
};

export default Categories;
