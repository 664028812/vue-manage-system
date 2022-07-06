import service from "../utils/request";


//获取模块信息
export const getModuleListPage = (data) => {
  return service({
    url: "​/api/Modules/get",
    method: "Post",
    data: data,
  });
};



//批量导入接口
export const Assign = (data) => {
  return service({
    url: "​/api/Permission/Assign",
    method: "Post",
    data: data,
  });
};

//删除接口
export const Get = (data) => {
  return service({
    url: "/api/Permission/Get",
    method: "Post",
    data: data,
  });
};


//获取接口
export const GetTreeTable = (data) => {
  return service({
    url: "/api/Permission/GetTreeTable",
    method: "Post",
    data: data,
  });
};


//增加接口
export const Post = (data) => {
  return service({
    url: "/api/Permission/Post",
    method: "Post",
    data: data,
  });
};


//更新接口
export const GetPermissionTree = (data) => {
  return service({
    url: "/api/Permission/GetPermissionTree",
    method: "Post",
    data: data,
  });
};


export const GetNavigationBar = (data) => {
  return service({
    url: "/api/Permission/GetNavigationBar",
    method: "Post",
    data: data,
  });
};


export const GetPermissionIdByRoleId = (data) => {
  return service({
    url: "/api/Permission/GetPermissionIdByRoleId",
    method: "Post",
    data: data,
  });
};


export const Put = (data) => {
  return service({
    url: "/api/Permission/Put",
    method: "Post",
    data: data,
  });
};



export const Delete = (data) => {
  return service({
    url: "/api/Permission/Delete",
    method: "Post",
    data: data,
  });
};