import service from "../utils/request";





//获取用户信息接口处理不分页那种
export const GetRoles = (data) => {
  return service({
    url: "/api/Role/Get",
    method: "Post",
    data: data,
  });
};

//查询query 包含分页
export const QueryRoles = (data) => {
  return service({
    url: "/api/Role/Query",
    method: "Post",
    data: data,
  });
};


//增加role
export const AddRole = (data) => {
  return service({
    url: "/api/Role/Add",
    method: "Post",
    data: data,
  });
};


//增加role
export const DeleteRole = (data) => {
  return service({
    url: "/api/Role/Delete",
    method: "Post",
    data: data,
  });
};


//更新
export const UpdateRole = (data) => {
  return service({
    url: "/api/Role/Update",
    method: "Post",
    data: data,
  });
};


//设置用户角色关系
export const SetUserRole = (data) => {
  return service({
    url: "/api/Role/SetUserRole",
    method: "Post",
    data: data,
  });
};


