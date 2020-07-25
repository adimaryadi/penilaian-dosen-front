<template>
    <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="content">
            <header>
                <h2>Audit Log</h2>
            </header>
            <transition name="slide-fade">
                <div class="table-selected">
                    <div class="row">
                        <div class="col-md-2">
                            <div class="form-group">
                                <div class="fieldset">
                                    <label for="" style="width: 100% !important;">Select Class</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="form-group">
                                <div class="fieldset">
                                    <select name="" id="" v-model="clazz" @change="SelectedClazz">
                                        <option value="MUser">User</option>
                                        <option value="MRole">Role</option>
                                        <option value="Action">Action</option>
                                        <option value="MPartner">Partner</option>
                                        <option value="MPartnerFee">Partner Fee</option>
                                        <option value="MPartnerCustomer">Partner Customer</option>
                                        <option value="MApiService">Api Service</option>
                                        <option value="MBackendService">Backend Service</option>
                                        <option value="MParameter">System Parameter</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-2">
                            <div class="form-group">
                                <div class="fieldset">
                                    <label for="" style="width: 100% !important;">Search By Date</label>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="col-md-3">
                            <div class="form-group">
                                <input type="date" class="form-control date" v-model="StartDate">
                                <span>Start</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <input type="date" class="form-control date" v-model="EndDate">
                                <span>End</span>
                            </div>
                        </div> -->
                        <div class="col-md-9">
                           <div class="search-date">
                                <date-range-picker v-model="DateRange"  ref="picker" :time-picker="false" :disabled="false" :linked-calendars="false" :auto-apply="true" style="min-width: 251px;">
                                </date-range-picker>
                                <b-button v-b-tooltip.hover @click="SelectedPage">
                                    <i class="fas fa-search"></i>
                                </b-button>
                           </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                        </div>
                        <div class="col-md-6">
                            <!-- <div class="form-group">
                                <div class="fieldset position">
                                    <button class="button button-next" @click="SelectedPage">Seacrh</button>
                                </div>
                            </div> -->
                        </div>
                    </div>
                    <div class="tables-result">
                        <b-table show-empty :items="items"  :fields="fields" :busy="isBusy" :current-page="currentPage" :responsive="true" :per-page="0" >
                            <template v-slot:cell(mod)="data">
                                <b-badge variant="success">{{ data.item.mod }}</b-badge>
                            </template>
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Loading...</strong>
                                </div>
                            </template>
                        </b-table>
                        <b-pagination align="center" v-model="currentPage" @change="SelectedPage" :total-rows="totalItems" :per-page="perPage" size="sm" aria-controls="my-table"></b-pagination>
                    </div>
                </div>                
            </transition>
        </div>
    </div>
</template>

<script>
import ServiceAuditLog from '../service/ServiceAuditLog';
import FunctionService from '../service/FunctionService';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
export default {
    data() {
        return {
            fields:             [],
            items:              [],
            currentPage:        1,
            totalItems:         0,
            perPage:            5,
            term:               "",
            StartDate:          "",
            EndDate:            "",
            clazz:              "MUser",
            isBusy:             false,
            DateRange:          {
                startDate:      "",
                endDate:        ""
            }
        }
    },
    components: {
        DateRangePicker
    },
    methods: {
        SelectedClazz() {
            this.currentPage        =       1;
            this.GetDataAudit(this.currentPage, this.perPage,this.term,this.clazz,this.DateRange.startDate,this.DateRange.endDate);
        },
        SelectedPage() {
            // window.console.log(this.StartDate);
            this.GetDataAudit(this.currentPage, this.perPage,this.term,this.clazz,this.DateRange.startDate,this.DateRange.endDate);
        },
        // dateFormat(classes, date) {
        //     if (!classes.disabled) {
        //         classes.disabled     =     date.getTime() < new Date();
        //     }
        //     return classes;
        // },
        GetDataAudit(currentPage, perPage,term,clazz,StartDate,EndDate) {
            this.isBusy         =       true;
            return new Promise((resolve, reject) => {
                ServiceAuditLog.getAuditLog(currentPage,perPage,term,clazz,StartDate,EndDate)
                .then((result) => {
                    if (result.status == 200) {
                        this.fields             =           [];
                        this.items              =           [];
                        this.isBusy             =           false;
                        if (result.data.data.length < 1) {
                            this.$notify(({
                                group:     "notif",
                                type:      "info",
                                title:     "No Records Found",
                                duration:  5000
                            }));
                        } else {
                            let KeyObject           =           [];
                            KeyObject.push(Object.keys(result.data.data[0].entity));
                            for (let i = 0; i < KeyObject[0].length; i++) {
                                this.fields.push(
                                {
                                    key:        "revisionDate",
                                    label:      "Revision Date",
                                    sortable:   true,
                                    class:      'table-set'
                                },
                                {
                                    key:        "mod",
                                    label:      "MOD",
                                    sortable:   true,
                                    class:      'table-set'
                                },
                                {
                                    key:        KeyObject[0][i],
                                    label:      KeyObject[0][i].replace(/([A-Z])/g, ' $1').trim(),
                                    sortable:   true,
                                    class:      'table-set'
                                });
                            }
                            // window.console.log(KeyObject);
                            // for (let i = 0; i < result.data.data.length; i++) {
                            //    this.items.push({
                            //        actived:         result.data.data[i].entity.actived
                            //    });
                            // }
                            
                            for (let obj in result.data.data) {
                                if (result.data.data.hasOwnProperty(obj)) {
                                    let inObject            =   {};
                                    inObject                =   result.data.data[obj].entity;
                                    inObject.revisionDate   =   FunctionService.DateLong(result.data.data[obj].rev.revisionDate);
                                    inObject.mod            =   result.data.data[obj].mod;
                                    this.items.push(inObject);
                                    // window.console.log(inObject);
                                }
                            }
                            this.isBusy             =       false;
                            this.totalItems         =       result.data.count;
                            // window.console.log(this.items);
                        }
                        // window.console.log(this.fields);
                    } else {
                        let Message            =            '';
                        if (result.statusText == undefined) {
                            Message            =            'No Intenet Access';
                        } else {
                            Message            =            result.statusText;
                        }
                        this.currentPage       =            0;
                        this.$notify({
                            group:      'notif',
                            type:       'error',
                            title:      'Failed audit log ',
                            text:       Message,
                            duration:   5000
                        });
                    }
                    // window.console.log(result);
                }).catch(() => {
                    reject("error");
                });
            });
        },
        
    },
    created() {
        let DateNow                     =       FunctionService.GetDateNow();
        this.DateRange.startDate        =       DateNow;
        this.DateRange.endDate          =       DateNow;
        // window.console.log(this.DateRange);
        this.GetDataAudit(this.currentPage,this.perPage,this.term,this.clazz,this.DateRange.startDate,this.DateRange.endDate);
    }
}
</script>

<style lang="css">
    .form-group .fieldset label {
        /* width: 100% !important; */
        margin-top: 15px;
    }
    .table-selected {
        padding-left: 8px;
    }
    .form-group .date {
        position: relative;
        width: 100%;
    }
    .fieldset.position button {
        position: absolute;
        right: 8px;
    }
    .fieldset.position {
        position: relative;
    }
    .form-group span {
        position: relative;
        font-size: 0.7em;
        left: 2px;
    }
    .search-date button {
        height: 37px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0px;
        margin-bottom: 2px;
        width: 36px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        position: relative;
        right: 1px;
    }
    .search-date button i {
        position: relative;
        right: 5px;
    }
</style>