<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Manage User</h2>
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

              <template v-slot:cell(actions)="row">
                <b-button
                  size="sm"
                  class="mr-1"
                  v-b-tooltip.hover
                  title="Edit"
                  @click="editData(row.item)"
                >
                  <i class="far fa-edit"></i>
                </b-button>
                <b-button
                  size="sm"
                  class="mr-1"
                  v-b-tooltip.hover
                  title="Remove"
                  @click="removeData(row.item)"
                >
                  <i class="far fa-trash-alt"></i>
                </b-button>
                <b-button
                  size="sm"
                  class="mr-1"
                  v-b-tooltip.hover
                  title="Generate Password"
                  :disabled="isGenerated"
                  @click="generatePw(row.item)"
                >
                  
                  <b-spinner small class="loading-button" :id="row.item.userId"></b-spinner>
                  <div class="icon-select" :id="row.item.userId">
                    <i class="fas fa-cogs" ></i>
                  </div>
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

          <div class="button-group">
            <a class="button button-next" @click="details = true">
              <i class="fas fa-plus"></i> Add User
            </a>
          </div>
        </div>
      </transition>

      <transition name="slide-fade">
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
                <label>Username</label>
                <b-form-input v-model="data.username" :type="text"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Email</label>
                <b-form-input v-model="data.email" :type="text"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Phone Number</label>
                <b-form-input v-model="data.phoneNumber" :type="text"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Mobile Number</label>
                <b-form-input v-model="data.mobileNumber" :type="text"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Name</label>
                <b-form-input v-model="data.officerName" :type="text"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Employee ID</label>
                <b-form-input v-model="data.officerCode" :type="text"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Access</label>
                  <multiselect
                    v-model="data.roles"
                    id="ajax"
                    label="rolename"
                    track-by="rolename"
                    placeholder="Type to search"
                    open-direction="bottom"
                    :options="roles"
                    :multiple="true"
                    :searchable="true"
                    :loading="isLoading"
                    :internal-search="false"
                    :clear-on-select="false"
                    :close-on-select="false"
                    :options-limit="300"
                    :max-height="150"
                    :show-no-results="false"
                    :hide-selected="true"
                    @search-change="asyncFind"
                  >
                    <template slot="tag" slot-scope="{ option, remove }">
                      <span class="custom__tag">
                        <b-badge  variant="secondary">
                          {{ option.rolename }}
                        <i class="fas fa-times" @click="remove(option)"></i>
                        </b-badge>
                      </span>
                    </template>
                    <template slot="clear" slot-scope="props">
                      <div
                        class="multiselect__clear"
                        v-if="data.roles.length"
                        @mousedown.prevent.stop="clearAll(props.search)"
                      ></div>
                    </template>
                    <span
                      slot="noResult"
                    >Oops! No elements found. Consider changing the search query.</span>
                  </multiselect>
              </div>
              <div class="fieldset">
                <label></label>
                <b-form-checkbox v-model="data.actived" name="check-button" switch>Active/Non Active</b-form-checkbox>
              </div>
              <div class="fieldset">
                <label></label>
                <b-form-checkbox v-model="data.alowLogin" name="check-button" switch>Block/Unblock</b-form-checkbox>
              </div>
            </div>

            <hr />

            <div class="button-group">
              <button type="button" class="button-back" v-on:click="resetField()">Back</button>
              <button type="button" class="button-next" @click="savedData">
                <b-spinner small v-if="loadingSave"></b-spinner>
                <span v-if="!loadingSave">Save</span>
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import userService from "../service/user-service";
import roleService from "../service/role-service";
import { isNullOrUndefined } from "util";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import FunctionService from '../service/FunctionService';

export default {
  name: "user",
  components: {
    Multiselect
  },
  data() {
    return {
      items: [],
      fields: [
        {
          key: "username",
          label: "Username",
          sortable: true
        },
        {
          key: "email",
          label: "Email",
          sortable: true
        },
        {
          key: "phoneNumber",
          label: "Phone Number",
          sortable: true
        },
        { key: "actions", label: "Actions", class: "text-center" }
      ],
      currentPage: 1,
      perPage: 5,
      totalItems: 0,
      details: false,
      term: "",
      isBusy: false,
      data: {roles: []},
      roles: [],
      isLoading: false,
      loadingSave:  false,
      isGenerated: false,
      errors: []
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
            this.isBusy = false;
            window.console.log(this.items);
            resolve(response);
          })
          .catch(() => {
            reject("error");
          });
      });
    },
    savedData : function(e) {
      this.errors = [];
      
      if (!this.data.username) {
        this.errors.push('Username required.');
      }
       if (!this.data.email) {
        this.errors.push('Email required.');
      }
       if (!this.data.officerName) {
        this.errors.push('Name required.');
      }
       if (!this.data.officerCode) {
        this.errors.push('ID required.');
      }

      if(this.errors.length < 1) {
        this.loadingSave        =       true;
        return new Promise((resolve, reject) => {
        userService
          .createUser(this.data)
          .then(response => {
            this.$notify({
              group: "notif",
              type: "success",
              title: "Info: ",
              text: response.data.message
            });
            this.loadingSave    =       false;
            this.resetField();
            resolve(response);
          })
          .catch(err => {
            this.loadingSave    =       false;
            reject(err);
          });
      });
      }
       e.preventDefault();
    },
    editData(data) {
      this.errors = [];
      this.data = data;
      this.details = true;
    },
    removeData(data) {
      if (
        confirm("Are you sure you want to delete this user '" + data.username + "' ?")
      ) {
        return new Promise((resolve, reject) => {
          userService
            .removeUser(data)
            .then(response => {
              this.$notify({
                group: "notif",
                type: "success",
                title: "Info: ",
                text: response.data.message
              });
              this.fetchData().catch(() => {});
              resolve(response);
            })
            .catch(err => {
              reject(err);
            });
        });
      }
    },generatePw(data){
       if (confirm("Are you sure you want to generate passwd for this user '" + data.username + "' ?")) {
         this.isGenerated        =      true;
         window.console.log(data);
         FunctionService.ShowLoading(data.userId);
         return new Promise((resolve, reject) => {
                userService
                  .generatePwd(data)
                  .then(response => {
                    this.$notify({
                      group: "notif",
                      type: "success",
                      title: "Info: ",
                      text: response.data.message
                    });
                    this.isGenerated        =      false;
                    FunctionService.HideLoading(data.userId);
                    resolve(response);
                  })
                  .catch(err => {
                    this.isGenerated        =      false;
                    FunctionService.HideLoading(data.userId);
                    reject(err);
                  });
              });
      }
    },
    resetField() {
      this.fetchData();
      this.data = {roles: []};
      this.details = !this.details;
    },
    limitText(count) {
      return `and ${count} other roles`;
    },
    asyncFind(query) {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        roleService
          .getRoles(query)
          .then(response => {
            this.roles = response.data.data;
            this.isLoading = false;
            resolve(response);
          })
          .catch(() => {
            reject("error");
          });
      });
    },
    clearAll() {
      this.data.roles = [];
    }
  },
   created() {
       this.asyncFind("");
   }
  ,
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
  transition: background-position 150ms ease-out;
}
.slide-fade-leave-active {
  transition: background-position 150ms ease-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  /* transform: translateY(10px);
  opacity: 0; */
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
.form-group .fieldset label {
    width: none !important;
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