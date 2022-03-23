import service from "../utils/request";


//获取用户信息接口处理
export const GetAllUser = (data) => {
  return service({
    url: "/api/User/GetAllUser",
    method: "Post",
    data: data,
  });
};


//删除用户
export const DeleteUser = (data) => {
  return service({
    url: "/api/User/Deleter",
    method: "Post",
    data: data,
  });
};

///api/User/GetUserInfoById
export const GetUserInfoById = (data) => {
  return service({
    url: "/api/User/GetUserInfoById",
    method: "Post",
    data: data,
  });
};


//注册用户
export const Register = (data) => {
  return service({
    url: "/api/User/Register",
    method: "Post",
    data: data,
  });
};



//更新用户
export const UpdateUser = (data) => {
  return service({
    url: "/api/User/UpdateUser",
    method: "Post",
    data: data,
  });
};

