import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import MetaData from "../layout/metaData";
import Loader from "../layout/loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {  clearError, allUsers, deleteUser} from "../../Action/userAction";
import Sidebar from "./Sidebar";
import { DELETE_USER_RESET } from "../../constants/userConstant";

const UsersList = () => {
    const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.allUsers);
  const {isDeleted} = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(allUsers());
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    
    if(isDeleted){
      alert.success("User deleted successfully");
      navigate("/admin/users");
      dispatch({type:DELETE_USER_RESET})
    }
  }, [alert, dispatch, error, isDeleted, navigate]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  }

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "User ID",
          field: "Id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "Actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    users.forEach((element) => {
      data.rows.push({
        Id: (element._id),
        name: element.name,
        email: element.email,
        role: element.role,
        Actions: (
          <Fragment>
            <Link
              to={`/admin/user/${element._id}`}
              className="btn btn-primary  py-1 px-2"
              
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button className="btn btn-danger  py-1 px-2 ml-2" onClick={() => {deleteUserHandler(element._id)}}>
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  }
  return (
    <Fragment>
      <MetaData title={"ALL Users"} />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
          <Fragment>
            <h1 className="mt-5">All Users</h1>
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                className="px-2"
                striped
                bordered
                hover
                data={setUsers()}
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default UsersList