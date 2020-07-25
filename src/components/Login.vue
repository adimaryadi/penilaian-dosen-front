<template>
<body>
  <div class="container">
    <nav>
      <div class="nav-toggle">
        <i class="fas fa-bars"></i>
      </div>
      <div class="nav-brand">
        <div class="logo">
          
        </div>
        <h3>UNIVERSITAS </h3><h3 style="text-transform: CAPITALIZE;">FALETEHAN</h3>
      </div>
      <div class="nav-account">
        <div class="info">
          <span>{{ timenow }}</span>
        </div>
      </div>
    </nav>
  </div>

  <main>
    <div class="container">
      <div class="login-form">
        <div class="row">
          <div class="col-md-4">
            <div class="logo-login">
              <img src="../assets/img/logo.png" alt="">
            </div>
          </div>
          <div class="col-md-8">
            <form @submit.prevent="callLogin()" autocomplete="on">
              <div class="form-group">
                <div class="fieldset">
                  Username
                  <input type="email" v-model="user" placeholder="Email" autofocus  autocomplete="on"/>
                </div>
                <div class="fieldset">
                  Password
                  <input type="password" placeholder="password" v-model="password" autocomplete="new-password" />
                </div>
                <div class="fieldset">
                  <b-btn variant="success" type="submit" :disabled="loading" >
                    <b-spinner small v-if="loading"></b-spinner>
                    <span class="sr-only" v-if="loading">Loading...</span>
                    <span v-if="!loading">Log in</span>
                  </b-btn>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</template>
   

<script>
import "select2/dist/js/select2";
import "jquery/dist/jquery";
import "jquery-ui/ui/jquery-1-7";
import "slick-carousel/slick/slick";
import "../assets/js/script";
import "../assets/css/sanitize.css";
import "../assets/css/all.css";
import * as moment from 'moment'

export default {
  name: "login",

  data() {
    return {
      loginError: false,
      user: "",
      password: "",
      error: false,
      errors: [],
      loading: false,
      timenow:       ''
    };
  },
  methods: {
    callLogin() {
      this.loading    =   true;
      this.errors     =   [];
      // window.console.log(this.loading);
      this.$store
        .dispatch("login", { user: this.user, password: this.password })
        .then(res => {
              // window.console.log(res.data);
              if (res.data.hasil == 'user_ok') {
                  this.loading    =    false;
                  localStorage.setItem('session', res.data.token);
                  this.$notify({
                      group: "notif",
                      type:  "success",
                      title: "Success ",
                      text:  res.data.hasil,
                      duration: 5000
                  });
                  this.$router.push('/');
              } else {
                  this.loading    =    false;
                  this.$notify({
                    group: "notif",
                    type:  "error",
                    title: "Kesalahan ",
                    text:  res.data.hasil,
                    duration: 5000
                  });
              }
          },
          response => {
            this.loading = false;
            this.$notify({
              group: "notif",
              type: "error",
              title: "Error: ",
              text: response.data.message
            });
          }
        )
        .catch(error => {
          this.loginError = true;
          this.errors.push(error);
          this.error = true;
        });
    }
  },
  created() {
    setInterval(() => {
      let time         =          moment().format('dddd, D MMMM YYYY - h:mm:ss A');
      this.timenow     =          time;
    }, 1000);
  }
};
</script>
<style scoped>
    body {
        background: #f5f5f5;
        padding-bottom: 50px;
        position: relative;
        margin: 0;
        min-height: 100vh;
    }
    nav {
        margin-left: 0;
        margin-right: 0;  
    }
    .logo-login  {
        position: relative;
        text-align: center;
        margin-top: 40px;
        margin-bottom: 40px;
        overflow: hidden;
        height: 125px;
        width: 148px;
        margin-top: 75px;
    }
    .logo-login img {
      width: 100%;
    }
    .login-form .form-group {
        margin-left: 4px;
    }
    .login-form .form-group .fieldset {
      max-width: none !important;
    }
    .nav-brand h3 {
        position: relative;
        color: white;
        text-transform: uppercase;
        margin-left: 4px;
        font-size: 0.9em;
    }
    .logo img {
        width: 100%;
        height: 100% !important;
    }
    .login-form {
        border-top: 24px solid #03ad09;
    }
    .fieldset .btn-success {
      background-color: #03ad09 !important;
    }
    .fieldset .btn-success span {
      color: white !important;
    }
    @media only screen and (max-width: 992px) {
       nav {
          position: relative;
       }
       nav .nav-toggle i {
         display: none;
       }
    }
    
</style>

