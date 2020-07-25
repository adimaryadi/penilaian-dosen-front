<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Manage Action</h2>
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
              <template v-slot:cell(enableOnTenant)="row">
                <i class="fas fa-check" v-if="row.item.enableOnTenant == true"></i>
                <i class="fas fa-times" v-if="row.item.enableOnTenant == false"></i>
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
              <i class="fas fa-plus"></i> Add Action
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
                <label>Action Name</label>
                <b-form-input v-model="data.actionName"></b-form-input>
              </div>
              <div class="fieldset">
                <label></label>
                <b-form-checkbox
                  v-model="data.enableOnTenant"
                  name="check-button"
                  switch
                >Active Status</b-form-checkbox>
              </div>
              <div class="fieldset">
                <label>Service / API</label>
                <multiselect
                  v-model="data.services"
                  id="ajax"
                  label="id"
                  track-by="id"
                  placeholder="Type to search"
                  open-direction="bottom"
                  :options="services"
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
                  @search-change="asyncFindService"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <b-badge variant="secondary">
                        {{ option.id }}
                        <i class="fas fa-times" @click="remove(option)"></i>
                      </b-badge>
                    </span>
                  </template>
                  <template slot="clear" slot-scope="props">
                    <div
                      class="multiselect__clear"
                      v-if="data.services.length"
                      @mousedown.prevent.stop="clearAll(props.search)"
                    ></div>
                  </template>
                  <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
                </multiselect>
              </div>
              <div class="fieldset">
                <label>UI / Menu</label>
                <multiselect
                  v-model="data.uiComponents"
                  id="ajax"
                  label="uiName"
                  track-by="uiName"
                  placeholder="Type to search"
                  open-direction="bottom"
                  :options="uiComponents"
                  :multiple="true"
                  :searchable="true"
                  :loading="isLoadingComponent"
                  :internal-search="false"
                  :clear-on-select="false"
                  :close-on-select="false"
                  :options-limit="300"
                  :max-height="150"
                  :show-no-results="false"
                  :hide-selected="true"
                  @search-change="asyncFindComponent"
                >
                  <template slot="tag" slot-scope="{ option, remove }">
                    <span class="custom__tag">
                      <b-badge variant="secondary">
                        {{ option.uiName }}
                        <i class="fas fa-times" @click="remove(option)"></i>
                      </b-badge>
                    </span>
                  </template>
                  <template slot="clear" slot-scope="props">
                    <div
                      class="multiselect__clear"
                      v-if="data.uiComponents.length"
                      @mousedown.prevent.stop="clearAllComponent(props.search)"
                    ></div>
                  </template>
                  <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
                </multiselect>
              </div>
            </div>
            <hr />

            <div class="button-group">
              <button type="button" class="button-back" v-on:click="resetField()">Back</button>
              <button type="button" class="button-next" @click="savedData">
                <b-spinner v-if="loadingSave"></b-spinner>
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
import servicesService from "../service/services-service";
import uiComponentService from "../service/ui-component-service"
import actionService from "../service/action-service";
import { isNullOrUndefined } from "util";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
  name: "action",
  components: {
    Multiselect
  },
  data() {
    return {
      items: [],
      errors: [],
      fields: [
        {
          key: "actionName",
          label: "Action Name",
          sortable: true
        },
        {
          key: "enableOnTenant",
          label: "Active Status",
          class: "text-center"
        },
        { key: "actions", label: "Actions", class: "text-center" }
      ],
      currentPage: 1,
      perPage: 5,
      totalItems: 0,
      details: false,
      term: "",
      isBusy: false,
      data: {services: [],uiComponents: []},
      services: [],
      isLoading: false,
      loadingSave:    false,
      uiComponents: [],
      isLoadingComponent: false
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
        actionService
          .getActions(this.currentPage, this.perPage, this.term)
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
    savedData: function(e){
      this.errors = [];
      if (!this.data.actionName) {
        this.errors.push('Name required.');
      }else{
        this.loadingSave      =     true;
        return new Promise((resolve, reject) => {
        actionService
          .inserOrUpdateAction(this.data)
          .then(response => {
            this.$notify({
              group: "notif",
              type: "success",
              title: "Info: ",
              text: response.data.message
            });
            this.resetField();
            this.loadingSave    =     false;
            resolve(response);
          })
          .catch(err => {
            this.loadignSave    =     false;
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
        confirm("Are you sure you want to delete this action '" + data.actionName + "' ?")
      ) {
        return new Promise((resolve, reject) => {
          actionService
            .removeAction(data)
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
      this.data = {services: [], uiComponents: []};
      this.details = !this.details;
    },
    asyncFindService(query) {
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        servicesService
          .getServicesByTerm(query)
          .then(response => {
            this.services = response.data.data;
            this.isLoading = false;
            resolve(response);
          })
          .catch(() => {
            reject("error");
          });
      });
    },
    asyncFindComponent(query) {
      this.isLoadingComponent = true;
      return new Promise((resolve, reject) => {
        uiComponentService
          .getComponentByTerm(query)
          .then(response => {
            this.uiComponents = response.data.data;
            this.isLoadingComponent = false;
            resolve(response);
          })
          .catch(() => {
            reject("error");
          });
      });
    },
    clearAll() {
      this.data.services = [];
    }
    ,
    clearAllComponent() {
      this.data.uiComponents = [];
    }
  },
  created() {
       this.asyncFindService("");
       this.asyncFindComponent("");
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
  color: #fff !important;
  background-color: #1487d6 !important;
  font-size: 10px !important;
  padding: 2px 12px !important;
  margin-bottom: 8px !important;
  margin-right: 4px !important;
}
.multiselect {
  width: calc(70% - 32px) !important;
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
.multiselect__clear::after,
.multiselect__clear::before {
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