<template>
  <div class="col-xs-12 col-sm-12 col-md-9">
    <div class="content">
      <header>
        <h2>Customer Linking Information</h2>
      </header>
      <transition name="slide-fade">
        <div  v-if="!PageDetail">
          <b-col sm="6" class="my-1">
            <b-form-group>
              <b-input-group size="sm">
                <b-form-input type="search" id="filterInput" v-on:keyup.enter="fetchData()" v-model="term" placeholder="Type to Search">

                </b-form-input>
                <b-input-group-append>
                  <b-button v-b-tooltip.hover @click="fetchData()" title="Cari">
                    <i class="fas fa-search"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <div class="col-sm-12">
            <b-table show-empty :items="items" :fields="fields" :busy="isBusy" :current-page="currentPage" :per-page="0">
              <template v-slot:table-busy>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>

              <template v-slot:cell(status)="data">
                <b-badge variant="success" v-if="data.item.status == 'LINKED'">{{ data.item.status }}</b-badge>
                <b-badge variant="primary" v-if="data.item.status == 'PENDING'">{{ data.item.status }}</b-badge>
                <b-badge variant="danger" v-if="data.item.status == 'UNLINKED'">{{ data.item.status }}</b-badge>
              </template>

              <template v-slot:cell(actions)="data">
                <b-button size="sm" class="mr-1" v-b-tooltip.hover title="View details" @click="DetailView(data.item)">
                  <i class="fa fa-eye"></i>
                </b-button>
              </template>

            </b-table>
            <b-pagination align="center" v-model="currentPage" :total-rows="totalItems" :per-page="perPage" size="sm" aria-controls="my-table">
            </b-pagination>
          </div>
        </div>
      </transition>

      <transition name="slide-fade">
        <div v-if="PageDetail">
            <div class="page-details">
              <div v-for="(item,property,index) in DetailSelected" :key="index">
                <div class="form-group">
                    <div class="fieldset">
                      <label>{{ Spacetext(property) }}</label>
                      <b-form-input readonly="readonly" :value="item"></b-form-input>
                    </div>
                </div>
              </div>
              <div class="button-group">
                <button class="button-back" @click="BackDetail">Back</button>
              </div>
            </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import accLinkingService from "../service/account-linking-service";
import { isNullOrUndefined } from "util";
import FunctionService from '../service/FunctionService';
export default {
  name: "customerlinkinginfo",
  data() {
    return {
      items: [],
      fields: [
        {
          key: "customerName",
          label: "Customer Name",
          sortable: true
        },
        {
          key: "accountNumber",
          label: "Account Number",
          sortable: true
        },
        {
          key: "cif",
          label: "CIF",
          sortable: true
        },
        {
          key: "address",
          label: "Address",
          sortable: true
        },
        {
          key: "phone",
          label: "Phone Number",
          sortable: true
        },
        {
          key: "status",
          label: "Status",
          sortable: true
        },
        {
          key:      "actions",
          label:    "Actions",
        }
      ],
      currentPage:     1,
      perPage:         5,
      totalItems:      0,
      term:            "",
      isBusy:          false,
      PageDetail:      false,
      DetailSelected: []
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
        accLinkingService
          .getCustomer(this.currentPage, this.perPage, this.term)
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
    Spacetext(text) {
       return text.replace(/([A-Z])/g, ' $1').trim();
    },
    DetailView(data) {
        this.PageDetail            =          true;
        // this.DetailSelected        =          data;
        this.DetailSelected        =          {
              accountNumber:        data.accountNumber,
              accountTitle:         data.accountTitle,
              address:              data.address,
              birthPlace:           data.birthPlace,
              challengeType1:       data.challengeType1,
              challengeType2:       data.challengeType2,
              challengeValue1:      data.challengeValue1,
              challengeValue2:      data.challengeValue2,
              cif:                  data.cif,
              coCode:               data.coCode,
              customerAccessToken:  data.customerAccessToken,
              customerName:         data.customerName,
              dateOfBirth:          FunctionService.DateLong(data.dateOfBirth),
              email:                data.email,
              gender:               data.gender,
              id:                   data.id,
              inactiveMarker:       data.inactiveMarker,
              legalDocExp:          FunctionService.DateLong(data.legalDocExp),
              legalDocId:           FunctionService.DateLong(data.legalDocId),
              legalDocName:         data.legalDocName,
              mmn:                  data.mmn,
              otpExpiredDate:       FunctionService.DateLong(data.otpExpiredDate),
              otpKey:               data.otpKey,
              phone:                data.phone,
              requestExpiredDate:   FunctionService.DateLong(data.requestExpiredDate),
              requestId:            data.requestId,
              sms:                  data.sms,
              status:               data.status
        }
        // window.console.log(data);
    },
    BackDetail() {
      this.PageDetail              =          false;
      this.DetailSelected          =          [];
      // window.console.log(this.DetailSelected);
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