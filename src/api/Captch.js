import service from "../utils/request";

export const CaptchData = (query) => {
  return service({
    url: "/base/Captcha",
    method: "Post",
    params: query,
  });
};
