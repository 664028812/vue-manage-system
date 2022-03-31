import service from "../utils/request";





//获取用户信息接口处理不分页那种
export const GetRoles = (data) => {
  return service({
    url: "/api/Role/Get",
    method: "Post",
    data: data,
  });
};

