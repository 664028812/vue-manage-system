<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">DBImport-Admin管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-row>
            <el-col :span="15"
              ><el-input style="width: 100%" v-model="param.captcha"> </el-input
            ></el-col>
            <el-col :span="9"
              ><img
                :src="param.picPath"
                alt="请输入验证码"
                style="max-width: 100%; max-height: 100%"
                @click="loginVerify()"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="loginSubmit()">登录</el-button>
        </div>
        <el-row>
          <el-col :span="12"
            ><p class="login-tips" style="color: red">注册账号</p></el-col
          >
          <el-col :span="12"
            ><p class="login-tips" style="color: red" align="right">
              忘记密码
            </p></el-col
          >
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import storeHanle from "../store/index.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { CaptchData, Login } from "../api/Captch.js";
export default {
  setup() {
    const router = useRouter();
    const param = reactive({
      username: "admin",
      password: "123123",
      captcha: "",
      captchaId: "",
      picPath: "",
    });

    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      verificationCode: [
        { required: true, message: "请输入验证码", trigger: "blur" },
      ],
    };
    //const login = ref(null);
    //const submitForm = () => {
    // login.value.validate((valid) => {
    //   if (valid) {
    //     ElMessage.success("登录成功");
    //     localStorage.setItem("ms_username", param.username);
    //     router.push("/");
    //   } else {
    //     ElMessage.error("登录成功");
    //     return false;
    //   }
    // });
    // };

    const store = useStore();
    store.commit("clearTags");

    return {
      param,
      rules,
      router,
      //store,
      //login,
      //submitForm,
    };
  },
  created() {
    this.loginVerify();
  },
  methods: {
    loginVerify() {
      CaptchData({}).then((ele) => {
        console.log("验证码信息获取", ele);
        this.param.picPath = ele.data.picPath;
        this.param.captchaId = ele.data.captchaId;
      });
    },
    loginSubmit() {
      Login({
        Captcha: this.param.captcha,
        CaptchaId: this.param.captchaId,
        Password: this.param.username,
        Username: this.param.username,
      }).then((res) => {
        if (res.code === 0) {
          ElMessage.success("登录成功");
          localStorage.setItem("ms_username", this.param.username); // 这里似乎可以不写 但是要处理路由哪儿
          storeHanle.commit("setUserInfo", res.data.UserInfo); //设置用户信息
          storeHanle.commit("setToken", res.data.token); //设置 token
          console.log("登录返回数据", res);
          this.router.push("/");
        } else {
          ElMessage.error("登录失败");
          this.loginVerify();
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
