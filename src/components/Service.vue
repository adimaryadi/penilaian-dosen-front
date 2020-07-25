<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Manage Service</h2>
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
              <template v-slot:cell(isUsed)="row">
                <i class="fas fa-check" v-if="row.item.isUsed == true"></i>
                <i class="fas fa-times" v-if="row.item.isUsed == false"></i>
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
                <label>Url</label>
                <b-form-input v-model="data.id.url" :disabled="true"></b-form-input>
              </div>
              <div class="fieldset">
                <label>Method</label>
                <b-form-input v-model="data.id.method" :disabled="true"></b-form-input>
              </div>
              <div class="fieldset">
                <label></label>
                <b-form-checkbox
                  v-model="data.isUsed"
                  name="check-button"
                  switch
                >Active Status</b-form-checkbox>
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
import servicesService from "../service/services-service";
import { isNullOrUndefined } from "util";

export default {
  name: "service",
  data() {
    return {
      items: [],
      fields: [
        {
          key: "id.url",
          label: "Url",
          sortable: true
        },
        {
          key: "id.method",
          label: "Method",
          class: "text-center"
        },
        {
          key: "isUsed",
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
      isBusy:           false,
      loadingSave:      false,
      data: {services: []},
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
        servicesService
          .getServices(this.currentPage, this.perPage, this.term)
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
    savedData : function(e) {
      this.errors = [];
      
      if (!this.data.id.url) {
        this.errors.push('Url required.');
      }
       if (!this.data.id.method) {
        this.errors.push('Method required.');
      }
      if(this.errors.length < 1){
        this.loadingSave        =     true;
        return new Promise((resolve, reject) => {
        servicesService
          .updateRole(this.data)
          .then(response => {
            this.$notify({
              group: "notif",
              type: "success",
              title: "Info: ",
              text: response.data.message
            });
            this.resetField();
            this.loadingSave      =     false;
            resolve(response);
          })
          .catch(err => {
            this.loadingSave      =     false;
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
    resetField() {
      this.fetchData();
      this.data = {services: []};
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