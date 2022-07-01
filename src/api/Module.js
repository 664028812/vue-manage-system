import service from "../utils/request";





//批量导入接口
export const BatchPostModules = (data) => {
  return service({
    url: "​/api​/Modules​/BatchPost",
    method: "Post",
    data: data,
  });
};

//删除接口
export const DeleteModule = (data) => {
  return service({
    url: "​/api​/Modules​/Delete",
    method: "Post",
    data: data,
  });
};


//获取接口
export const GetModules = (data) => {
  return service({
    url: "​/api​/Modules​/Get",
    method: "Post",
    data: data,
  });
};


//增加接口
export const PostModules = (data) => {
  return service({
    url: "​/api​/Modules​/Post",
    method: "Post",
    data: data,
  });
};


//更新接口
export const PutModule = (data) => {
  return service({
    url: "​/api​/Modules​/Put",
    method: "Post",
    data: data,
  });
};
