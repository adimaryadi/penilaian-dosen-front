<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Change Password</h2>
      </header>
      <transition name="slide-fade">
          <form @submit="changePw">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li  v-for="(error, idx) in errors" :key="idx">
                  {{ error }}
                </li>
              </ul>
            </p>
          <div class="form-group">
            <div class="fieldset">
              <label>Old Password</label>
              <input type="password" v-model="data.oldPassword"/>
            </div>
            <div class="fieldset">
              <label>New Password</label> 
              <input type="password"  v-model="data.newPassword" />
            </div>
            <div class="fieldset">
              <label>Retype Password</label>
              <input type="password" v-model="data.reTypePassword" />
            </div>
          </div>
            <div class="button-group">
              <button type="button" @click="changePw" class="button-next">
                <b-spinner small v-if="loading"></b-spinner>
                <span v-if="!loading">Save</span>
              </button>
            </div>
        </form>
      </transition>
    </div>
  </div>
</template>
<script>
import "select2/dist/js/select2";
import "jquery/dist/jquery";
import "jquery-ui/ui/jquery-1-7";
import "slick-carousel/slick/slick";
import "../assets/js/script";
import "../assets/css/sanitize.css";
import "../assets/css/all.css";
import userService from "../service/user-service";

export default {
  name: "changepw",

  data() {
    return {
      data: {},
      error: false,
      errors: [],
      loading: false
    };
  },
  methods: {
    changePw : function(e) {
     
      this.errors = [];
      
      if (!this.data.oldPassword) {
        this.errors.push('Old Password required.');
      }
       if (!this.data.newPassword) {
        this.errors.push('New Password required.');
      }
       if (!this.data.reTypePassword) {
        this.errors.push('Retype Password required.');
      }

      if(this.errors.length < 1){
      this.loading = true;
      return new Promise((resolve, reject) => {
        userService
          .changePw(this.data)
          .then(
          res => {
              if(res.status == 202){
                this.$notify({
                  group: "notif",
                  type: "warn",
                  title: "Info: ",
                  text: res.data.message,
                  duration: 5000
                });
                this.loading      =    false;
              }else{
                  this.$notify({
                      group: "notif",
                      type: "success",
                      title: "Info: ",
                      text: res.data.message
                    });
                    this.data = {};
                    this.callLogout();
                    this.loading      =    false;
                    // window.console.log(res);
              }
          },response => {
            this.$notify({
              group: "notif",
              type: "warning",
              title: "Info: ",
              text: response.message
            });
            this.loading      =    false;
            resolve(response);
          })
          .catch(err => {
            this.loading      =    false;
            reject(err);
          });
      });
      }
      e.preventDefault();
    },
    callLogout() {
      this.errors = [];
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push("/Login");
        })
        .catch(error => {
          this.loginError = true;
          this.errors.push(error);
          this.error = true;
        });
    }
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
</style>