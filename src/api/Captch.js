import service from "../utils/request";
//1. params 会将请求的参数拼接到url中去，用于get请求

//2. data 是添加到请求体(body)里面去，用于post请求
export const CaptchData = (query) => {
  return service({
    url: "/api/base/Captcha",
    method: "Post",
    params: query,
  });
};

//登录接口处理
export const Login = (data) => {
  return service({
    url: "/api/User/Login",
    method: "Post",
    data: data,
  });
};
