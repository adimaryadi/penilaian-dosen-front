<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Partner</h2>
      </header>
      <transition name="slide-fade">
        <div v-if="!details">
          <b-col sm="6" class="my-1">
            <b-form-group>
              <b-input-group size="sm">
                <b-form-input
                  type="search"
                  id="filterInput"
                  v-on:keyup.enter="fetchData()"
                  v-model="term"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button v-b-tooltip.hover @click="fetchData()" title="Cari">
                    <i class="fas fa-search"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <div class="col-sm-12">
            <b-table 
              :responsive="true"
              show-empty
              :items="items"
              :fields="fields"
              :busy="isBusy"
              :current-page="currentPage"
              :per-page="0"
            >
              <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(umUserName)="row">
                <b-link  v-if="row.item.partner.id != null" @click="viewData(row.item)"><i class="far fa-eye"><strong> {{row.item.umUserName}}</strong></i></b-link>
                <a v-if="row.item.partner.id == null">{{row.item.umUserName}}</a>
              </template>

              <template v-slot:cell(actions)="row">
                <b-button
                  size="sm"
                  class="mr-1"
                  v-b-tooltip.hover
                  title="Create Partner ID"
                  v-if="row.item.partner.id == null"
                  @click="editData(row.item)"
                >
                  <i class="far fa-edit"></i>
                </b-button>
                 <b-button
                  size="sm"
                  class="mr-1"
                  v-b-tooltip.hover
                  title="Update Partner ID"
                  v-if="row.item.partner.id != null"
                  @click="editData(row.item)"
                >
                  <i class="far fa-edit"></i>
                </b-button>
              </template>
            </b-table>
            <b-pagination
              align="center"
              v-model="currentPage"
              :total-rows="totalItems"
              :per-page="perPage"
              size="sm"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </div>
      </transition>

      <transition name="details">
        <div v-if="details">
          <form @submit="savedData">
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
                <label>User ID</label>
                <b-form-input v-model="data.umUserId" :disabled="data.umUserId != null || isView"></b-form-input>
                <button type="button" class="button-next" v-if="data.code != null" :disabled="isLoading" v-on:click="resendEmail(data)">
                  <b-spinner small v-if="isLoading"></b-spinner>
                  <span class="sr-only" v-if="isLoading">Loading...</span>
                  <span v-if="!isLoading">Resend Partner ID</span>
                </button>
              </div>
              <div class="fieldset">
                <label>Username</label>
                <b-form-input v-model="data.umUserName" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Given Name</label>
                <b-form-input v-model="data.givenName" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Surname</label>
                <b-form-input v-model="data.sn" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Email</label>
                <b-form-input v-model="data.mail" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Mobile Number</label>
                <b-form-input v-model="data.mobile" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Telephone</label>
                <b-form-input v-model="data.telephoneNumber" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Organization</label>
                <b-form-input v-model="data.organizationName" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Country</label>
                <b-form-input v-model="data.country" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>IM</label>
                <b-form-input v-model="data.im" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Url</label>
                <b-form-input v-model="data.url" :disabled="data.umUserId != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Partner Name</label>
                <b-form-input v-model="data.name" :disabled="data.id != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Partner ID</label>
                <b-form-input v-model="data.code" :disabled="data.id != null || isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Partner CIF</label>
                <b-form-input v-model="data.cif" :disabled="isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Partner Account Number</label>
                <b-form-input v-model="data.accountNumber" type="number" :disabled="isView"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Description</label>
                <b-form-input v-model="data.description" :disabled="isView"></b-form-input>
              </div>
            </div>

            <hr />

            <div class="button-group">
              <button type="button" class="button-back" v-on:click="resetField()">Back</button>
              <button type="button" class="button-next" v-if="!isView" :disabled="saveLoading" @click="savedData">
                <b-spinner small v-if="saveLoading"></b-spinner>
                <span v-if="!saveLoading">Save</span>
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import userService from "../service/wso2user-service";
import partnerService from "../service/partner-service";
import { isNullOrUndefined } from "util";

export default {
  name: "user",
  data() {
    return {
      items: [],
      fields: [
        {
          key: "umUserId",
          label: "User ID",
          sortable: true,
          thStyle: {width: '100px !important'}
        },
        {
          key: "umUserName",
          label: "Username",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },
        {
          key:        "partner.name",
          label:      "Partner Name",
          sortable:   true,
          thStyle:    { width: '100px !important'}
        },
        {
          key: "givenName",
          label: "Given Name",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "sn",
          label: "Surname",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "mail",
          label: "Email",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "mobile",
          label: "Mobile Number",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "telephoneNumber",
          label: "Telephone",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "organizationName",
          label: "Organization",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "country",
          label: "Country",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "im",
          label: "IM",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "url",
          label: "Url",
          sortable: true,
          thStyle: {width: '100px !important'}
          
        },{
          key: "partner.code",
          label: "Partner ID",
          sortable: true,
          class: "text-center",
          thStyle: {width: '100px !important'}
        },
        { key: "actions", label: "Actions", class: "text-center",
          thStyle: {width: '100px !important'} }
      ],
      currentPage: 1,
      perPage: 5,
      totalItems: 0,
      details: false,
      term: "",
      isBusy: false,
      data: {},
      isLoading: false,
      saveLoading: false,
      errors: [],
      isView: false
    };
  },
  mounted() {
    this.fetchData().catch(error => {
      window.console.error(error);
    });
  },
  methods: {
    async fetchData() {
      this.isBusy = true;
      return new Promise((resolve, reject) => {
        userService
          .getUser(this.currentPage, this.perPage, this.term)
          .then(response => {
            this.totalItems = response.data.count;
            this.items = response.data.data;
            window.console.log(this.items);
            this.isBusy = false;
            resolve(response);
          })
          .catch(() => {
            reject("error");
          });
      });
    },
    savedData: function(e) {
       this.errors = [];
      
      if (!this.data.umUserId) {
        this.errors.push('User ID required.');
      }
       if (!this.data.name) {
        this.errors.push('Partner Name required.');
      }
       if (!this.data.code) {
        this.errors.push('Partner Code required.');
      }
      if (!this.data.cif) {
        this.errors.push('CIF required.');
      }
      if (!this.data.accountNumber) {
        this.errors.push('Account Number required.');
      }
      if(this.errors.length < 1) {
        this.saveLoading        =     true;
        return new Promise((resolve, reject) => {
        partnerService
          .createData(this.data)
          .then(response => {
            this.$notify({
              group: "notif",
              type: "success",
              title: "Info: ",
              text: response.data.message
            });
            this.saveLoading      =     false;
            this.resetField();
            resolve(response);
          })
          .catch(err => {
            this.saveLoading      =     false;
            reject(err);
          });
      });
      }
      e.preventDefault();
    },
    resendEmail(data) {
         this.isLoading     =       true;
         return new Promise((resolve, reject) => {
                partnerService
                  .resendEmail(data)
                  .then(response => {
                    this.$notify({
                      group: "notif",
                      type: "success",
                      title: "Info: ",
                      text: response.data.message
                    });
                    this.isLoading        =     false;
                    resolve(response);
                  })
                  .catch(err => {
                    this.isLoading        =     false;
                    reject(err);
                  });
              });
    },
    editData(data) {
      this.isView = false;
      this.errors = [];
      if(data.partner.id != null){
         this.data = data.partner;
      }else{
         this.data = data;
      }
      
      this.details = true;
    },
    viewData(data) {
      this.isView = true;
      this.errors = [];
      const partner = data.partner;
      const umuser = data;
      delete umuser.partner;

      this.data = {...partner, ...umuser};

      window.console.log(this.data);
      this.details = true;
    },
    resetField() {
      this.fetchData();
      this.data = {};
      this.details = !this.details;
    }
  },
  watch: {
    currentPage: {
      handler: function(value) {
        if (!isNullOrUndefined(value)) {
          this.fetchData().catch(() => {});
        }
      }
    }
  }
};
</script>
<style>
.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.badge-secondary {
    color: #fff  !important;
    background-color: #1487D6  !important;
    font-size: 10px !important;
    padding: 2px 12px  !important;
    margin-bottom: 8px  !important;
    margin-right: 4px  !important;
}
.multiselect {
    width: calc(50% - 32px) !important;
}
.custom__tag i {
    margin-left: 4px;
}
.multiselect__strong {  
    display: block !important;
    font-size: 11px !important;
}
.custom-control-label {
    width: auto !important;
    line-height: 1.75;
}
.multiselect__clear {
    position: absolute;
    right: 41px;
    height: 40px;
    width: 40px;
    display: block;
    cursor: pointer;
    z-index: 2;
}
.multiselect__clear::before {
    transform: rotate(45deg);
}
.multiselect__clear::after {
    transform: rotate(-45deg);
}
.multiselect__clear::after, .multiselect__clear::before {
    content: "";
    display: block;
    position: absolute;
    width: 3px;
    height: 16px;
    background: #aaa;
    top: 12px;
    right: 4px;
}

</style>