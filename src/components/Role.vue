<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Manage Role</h2>
      </header>
      <transition name="slide-fade">
        <div v-if="!details">
          <b-col sm="6" class="my-1">
            <b-form-group>
              <b-input-group size="sm">
                <b-form-input
                  type="search"
                  id="filterInput"
                  v-model="term"
                  placeholder="Type to Search"
                  v-on:keyup.enter="fetchData()"
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
              <i class="fas fa-plus"></i> Add Role
            </a>
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
                <label>Role Name</label>
                <b-form-input v-model="data.rolename"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Description</label>
                <b-form-input v-model="data.description"></b-form-input>
              </div>
              <div class="fieldset">
              <label>Access</label>
              <multiselect
                v-model="data.actions"
                id="ajax"
                label="actionName"
                track-by="actionName"
                placeholder="Type to search"
                open-direction="bottom"
                :options="actions"
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
                    <b-badge variant="secondary">
                      {{ option.actionName }}
                      <i class="fas fa-times" @click="remove(option)"></i>
                    </b-badge>
                  </span>
                </template>
                <template slot="clear" slot-scope="props">
                  <div
                    class="multiselect__clear"
                    v-if="data.actions.length"
                    @mousedown.prevent.stop="clearAll(props.search)"
                  ></div>
                </template>
                <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
              </multiselect>
            </div>
            </div>
            <hr />

            <div class="button-group">
              <button type="button" class="button-back" v-on:click="resetField()">Back</button>
              <button type="submit" class="button-next">Save</button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import roleService from "../service/role-service";
import actionService from "../service/action-service"
import { isNullOrUndefined } from "util";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

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
          key: "rolename",
          label: "Role Name",
          sortable: true
        },
        {
          key: "description",
          label: "Description",
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
      data: {actions: []},
      actions: [],
      isLoading: false,
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
        roleService
          .getRole(this.currentPage, this.perPage, this.term)
          .then(response => {
            this.totalItems = response.data.count;
            this.items = response.data.data;
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
      
      if (!this.data.rolename) {
        this.errors.push('Role Name required.');
      }
       if(this.errors.length < 1){
         return new Promise((resolve, reject) => {
        roleService
          .inserOrUpdateRole(this.data)
          .then(response => {
            this.$notify({
              group: "notif",
              type: "success",
              title: "Info: ",
              text: response.data.message
            });
            this.resetField();
            resolve(response);
          })
          .catch(err => {
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
        confirm("Are you sure you want to delete this role '" + data.rolename + "' ?")
      ) {
        return new Promise((resolve, reject) => {
          roleService
            .removeRole(data)
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
    },
    resetField() {
      this.fetchData();
      this.data = {actions: []}
      this.details = !this.details;
    },
    limitText(count) {
      return `and ${count} other actions`;
    },
    asyncFind(query) {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        actionService
          .getActionsByTerm(query)
          .then(response => {
            this.actions = response.data.data;
            this.isLoading = false;
            resolve(response);
          })
          .catch(() => {
            reject("error");
          });
      });
    },
    clearAll() {
      this.data.actions = [];
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