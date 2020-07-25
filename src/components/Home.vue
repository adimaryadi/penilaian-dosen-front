<template>
<body>
  <div class="container" style="padding: 0;">
    <nav>
      <div class="nav-toggle">
        <i class="fas fa-bars"></i>
      </div>
      <div class="nav-brand">
        <!-- <span v-if="typeof data.userInfo !== 'undefined'">Welcome, {{data.userInfo.userName}}</span> -->
        <div class="logo">

        </div>
        <h3>UNIVERSITAS </h3><h3 style="text-transform: CAPITALIZE;">FALETEHAN</h3>
      </div>
      <div class="nav-account">
        <div class="info">
          <span v-if="typeof data.userInfo !== 'undefined'" >{{ timenow }} - {{ data.userInfo.userName }}</span>
        </div>
        <div class="logout" v-on:click="callLogout()">
          <div class="circle">
            <i class="fas fa-power-off"></i>
          </div>
          <span>Logout</span>
        </div>
      </div>
    </nav>
  </div>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <div class="sidebar" id="accordion">

            <div class="menu">
              <div class="title" >
                <i class="fa fa-users"></i>
                <p >
                  <router-link to="/" tag="li" exact></router-link>
                </p>
                <p @click="toggle">Data Dosen</p>
              </div>
              <ul class="dropdown"> 
                <li>
                  <router-link to="/daftar-dosen" exact>
                     <div class="row">
                        <div class="col-md-1">
                          <i class=""></i>
                        </div>
                        <div class="col-md-11">
                          <p>Daftar Dosen</p>
                        </div>
                     </div>
                  </router-link>
                </li>
              </ul>
            </div>

            <div class="menu">
              <div class="title" >
                <i class="fa fa-star" aria-hidden="true"></i>
                <p >
                  <router-link to="/" tag="li" exact></router-link>
                </p>
                <p @click="toggle">Penilaian Dosen</p>
              </div>
              <ul class="dropdown"> 
                <li >
                  <router-link to="/" exact>
                     <div class="row">
                        <div class="col-md-1">
                          <i class=""></i>
                        </div>
                        <div class="col-md-11">
                          <p>Kuisioner</p>
                        </div>
                     </div>
                  </router-link>
                </li>
              </ul>
            </div>

            <div class="menu">
              <div class="title" >
                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                <p >
                  <router-link to="/" tag="li" exact></router-link>
                </p>
                <p @click="toggle">Report</p>
              </div>
              <ul class="dropdown"> 
                <li >
                  <router-link to="/" exact>
                     <div class="row">
                        <div class="col-md-1">
                          <i class=""></i>
                        </div>
                        <div class="col-md-11">
                          <p>Laporan data</p>
                        </div>
                     </div>
                  </router-link>
                </li>
              </ul>
            </div>

            <div class="menu">
              <div class="title" >
                <i class="fa fa-cog" aria-hidden="true"></i>
                <p >
                  <router-link to="/" tag="li" exact></router-link>
                </p>
                <p @click="toggle">Konfigurasi</p>
              </div>
              <ul class="dropdown"> 
                <li >
                  <router-link to="/" exact>
                     <div class="row">
                        <div class="col-md-1">
                          <i class=""></i>
                        </div>
                        <div class="col-md-11">
                          <p>Daftar</p>
                        </div>
                     </div>
                  </router-link>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
        <transition name="moveInUp">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </main>
  <footer>
    <p><a href="https://cardbankph.com/" target="_blank" style="color: gray; text-decoration: none;">Copyright © CARD BANK {{ new Date().getFullYear() }}</a></p>
  </footer>
  <!-- <i class="fas fa-user-friends"></i> -->
</body>
</template>

<script>
import 'select2/dist/js/select2'
import 'jquery-ui/ui/jquery-1-7'
import 'slick-carousel/slick/slick'
import $ from 'jquery'
import { isNullOrUndefined } from 'util'
import * as moment from 'moment'
// import { setInterval } from 'timers'

export default {
  name: "home",
  data() {
    return {
        data:             {},
        loginError:       false,
        error:            false,
        errors:           [],
        isActive:         false,
        timenow:          '',
        SessionTimeOut:   []
    };
  },
  components: {
    // 'fa-icons': Faicon,
  },
  computed: {
    dataComputed() {
      return this.data;
    }
  },
  methods: {
    toggle() {
        $('.menu .title').click(function (e) {
          var current_dropdown = $(this).next(".dropdown");
          $(".dropdown").not(current_dropdown).slideUp();
          current_dropdown.slideDown();

          e.stopPropagation();
        });
        
        if ($('.dropdown li').hasClass('active')) {
          $('.active').parent('.dropdown').toggle();
          $('.active').parent('.dropdown').siblings('.title').css('border-left', '4px solid #1487D6');
          $('.active').parent('.dropdown').siblings('.title').find('i, p').css('color', '#1487D6');
        }
        
        if ($('.menu .title p').hasClass('active')) {
          $('.active').parent('.title').css('border-left', '4px solid #1487D6');
          $('.active').css('color', '#1487D6');
          $('.active').siblings('i').css('color', '#1487D6');
        }      
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
    },
    sidebar() {
        // initial JS nav toggle menu
        let MediaScreen        =     window.matchMedia("(max-width: 992px)");
        $('nav .nav-toggle').on('click', function() {
          $('.sidebar').toggle();
        });
        if (MediaScreen.matches == true) {
            $('.sidebar').css('display','none');
            $('.sidebar').on('click', function() {
              $('.sidebar').css('display','none');
            });

            $('nav .nav-toggle').on('click', function() {
              $('.sidebar').toggle();
            });
        } else {
            $('.sidebar').on('click', function() {
              $('.sidebar').css('display','block');
            });
            $('.sidebar').css('display','block');
        }

        MediaScreen.addListener(this.sidebar);
    },
    GetProfile() {
      this.$store
        .dispatch("getProfile")
        .then(response => {
          this.data             =     response.data;
          // window.console.log(response.data.uiAccess);
          if (response.data.uiAccess == null) {
              this.callLogout();
          }
          this.SessionTime(response.data.sessionTimeOut)
          if(!isNullOrUndefined(this.data.uiAccess)){
            this.data.uiAccess.sort(function(a, b) {
              return a.sortOrder - b.sortOrder;
            });
          }
        })
        .catch(error => {
          // window.console.log(error);
          this.$router.push("/Login");
          this.loginError = true;
          this.errors.push(error);
          this.error = true;
        });
    },
    SessionTime(time) {
        let idleTime         =      time;
        let stop;
        
        $(document).ready(function() {
          stop  =   setInterval(timerIncrement,1000);
          
          $(this).mousemove(function () {
            idleTime          =    time;
          });

          $(this).keypress(function() {
            idleTime          =    time;
          });

        });
        
        let Store                    =    this.$store;
        let router                   =    this.$router;
        function timerIncrement() {
          idleTime                   =    idleTime - 1;
          //  window.console.log(idleTime);
          if (idleTime <= 0) {
            var   r     =    confirm("session is over whether to continue the session");
            if (r == true) {
              idleTime  =    time;
              
              // window.console.log(idleTime);
            } else {
              Store.dispatch("logout")
              .then(() => {
                router.push("/Login");
              });
              clearInterval(stop);
            }
          }
        }
    }
  },
  mounted: function() {
    this.sidebar();
    // this.SessionTime();
  },
  created() {
    this.errors = [];
    setInterval(() => {
      let time        =        moment().format('dddd, D MMMM YYYY - h:mm:ss A');
      this.timenow    =        time;
    },1000);
    // this.GetProfile();
  }
};
</script>

<style>
@import '../assets/css/sanitize.css';
@import '../assets/css/all.css';
@import '../assets/scss/layout/_sidebar.scss';

body {
  background: #F5F5F5;
  padding-bottom: 50px;
  position: relative;
  margin: 0;
  min-height: 100vh;
}
.moveInUp-enter-active {
  animation: fadeIn 0.1s ease-in;
}
.nav-account .logout .circle {
  background-color: #03ad09 !important;
}
.logo {
    position: relative;
    margin-left: 27px;
    width: 40px;
    border-radius: 110px;
    /* border: 1px solid; */
    overflow: hidden;
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
.dropdown li a p {
    position: relative;
    display: inline;
    top: 0px;
    margin-top: 6px;
    margin-left: 6px;
}
.dropdown li a i {
    margin-left: 0px;
    margin-right: 0px;
}
nav .nav-account .logout span {
  color: #03ad09 !important;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.moveInUp-leave-active {
  animation: moveInUp 0.1s ease-in;
}
@keyframes moveInUp {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-400px);
  }
}
@media only screen and (max-width: 992px) {
  nav {
    position: relative !important;
  }
}
@media screen and (max-width: 799px) {
  .dropdown .row .col-md-1 {
    width: 12px;
  }
  .dropdown .row .col-md-11 {
    width: 198px;
  }
}

</style>