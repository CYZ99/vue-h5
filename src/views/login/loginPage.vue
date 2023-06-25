<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules/loginRules'
import { loginByPassword, loginByMobile } from '@/api/userApi'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { useSendCode } from '@/hooks/useSendCode'

// 获取路由对象进行跳转
const router = useRouter()
// 获取路由参数
const route = useRoute()
const store = useUserStore()

const isArgee = ref<boolean>(false)
const isShowPswd = ref<boolean>(false)
const mobileRef = ref<string>('13230000001')
const passwordRef = ref<string>('abc12345')
const isPass = ref<boolean>(true)

const clickRight = () => {
  console.log('点击了右边的按钮')
}

const login = async () => {
  if (isArgee.value) {
    try {
      const res = isPass.value
        ? await loginByPassword(mobileRef.value, passwordRef.value)
        : await loginByMobile(mobileRef.value, code.value)
      // 将数据存放在 本地缓存中
      store.setUser(res.data)
      // 路由跳转 短路效应 存在 返回地址则跳转到返回地址,如果不存在则默认跳转到 /user
      router.push((route.query.returnUrl as string) || '/user')
      showSuccessToast('登录成功')
    } catch (error) {
      console.log(error)
    }
  } else {
    return showFailToast('请勾选同意协议')
  }
}

// 发送验证码,抽离到 hooks 主要考虑的因素是逻辑复用,其次代码整洁
const { time, send, code, form } = useSendCode(mobileRef.value)
</script>

<template>
  <div class="login">
    <cp-nav-bar title="登录" rightText="注册" @click-right="clickRight"></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        placeholder="请输入手机号"
        v-model="mobileRef"
        name="mobile"
        :rules="mobileRules"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        v-model="passwordRef"
        :type="isShowPswd ? 'text' : 'password'"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon
            @click="isShowPswd = !isShowPswd"
            :name="isShowPswd ? 'login-eye-on' : 'login-eye-off'"
          >
          </cp-icon>
        </template>
      </van-field>
      <van-field v-else placeholder="请输入短信验证码" v-model="code" :rules="codeRules">
        <template #button>
          <span class="btn-send" @click="send">
            {{ time > 0 ? `${time}s 后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="isArgee">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell" v-if="isPass">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 30px 50px;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  .van-form {
    padding: 0 14px;

    .cp-cell {
      height: 52px;
      line-height: 24px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
