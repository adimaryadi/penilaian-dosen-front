<template>
    <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="content">
            <header>
                <h2>Backend Service</h2>
            </header>
            
            <transition name="slide-fade">
                <div v-if="Tables">
                    <div class="field-form">
                        <b-col sm="6" class="my-1">
                            <b-form-group>
                                <b-input-group size="sm">
                                    <b-form-input
                                    type="search"
                                    id="filterInput"
                                    v-on:keyup.enter="SearchFilter()"
                                    v-model="term"
                                    placeholder="Type to Search"
                                    ></b-form-input>
                                    <b-input-group-append>
                                        <b-button v-b-tooltip.hover @click="SearchFilter()" title="Cari">
                                            <i class="fas fa-search"></i>
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-col>
                    </div>
                    <div class="table-result">
                        <b-table show-empty :fields="fields" :items="items" :busy="isBusy" :current-page="currentPage" :per-page="0">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong> Loading...</strong>
                                </div>
                            </template>
                            <template v-slot:cell(actions)="data">
                                <b-button size="sm" class="mr-1" title="Edit" @click="EditBackendService(data.item)">
                                    <i class="far fa-edit"></i>
                                </b-button>
                                <b-button size="sm" class="mr-1" title="Delete" @click="DeleteBackendService(data.item)">
                                    <i class="far fa-trash-alt"></i>
                                </b-button>
                            </template>
                        </b-table>
                        <b-pagination align="center" v-model="currentPage" :total-rows="totalItems" :per-page="perPage" size="sm" aria-controls="my-table"></b-pagination>
                    </div>
                    <div class="button-group">
                        <button class="button button-next" @click="AddBackendService">
                            <i class="fas fa-plus"></i> Add Backend Service
                        </button>
                    </div>
                </div>
            </transition>
            
            <b-toast id="message-form" variant="info">
                <template v-slot:toast-title>
                    <strong>Info</strong>
                </template>
                {{ MessageForm }}
            </b-toast>

            <transition name="slide-fade">
                <div v-if="formPage">
                    <div class="field-form">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="fieldset">
                                    <label for="">Service Name</label>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <multiselect v-model="ServiceName" track-by="serviceName" deselect-label="Can't remove this value" label="serviceName" placeholder="Select one" :options="ServiceData" :searchable="true" :allow-empty="false" @search-change="FindService">
                                        <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.serviceName }}</strong></template>
                                    </multiselect>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="fieldset">
                                    <label for="">End Point</label>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <b-form-input v-model="EndPoint"></b-form-input>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="fieldset">
                                    <label for="">Adaptor</label>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <b-form-input v-model="Adaptor"></b-form-input>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="fieldset">
                                    <label for="">Adapter</label>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <b-form-input v-model="Adapter"></b-form-input>
                                </div>
                            </div>
                        </div>
                        <div class="button-group">
                            <button class="button-back" @click="CloseSave()">Back</button>
                            <button class="button-next" @click="Save()">
                                <b-spinner v-if="loadingSave"></b-spinner>
                                <span v-if="!loadingSave">Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import BackendService from '../service/BackendService';
import { isNullOrUndefined } from "util";
import Multiselect from "vue-multiselect";
// import swal from 'sweetalert';
export default {
    data() {
        return  {
            fields:                     [
                {
                    key:        "serviceName",
                    label:      "Service Name",
                },
                {
                    key:        "endPoint",
                    label:      "End Point",
                },
                {
                    key:        "adaptor",
                    label:      "Adaptor",
                },
                {
                    key:        "adapter",
                    label:      "Adapter",
                },
                {
                    key:        "actions",
                    label:      "Action",
                }
            ],
            items:                      [],
            ServiceData:                [],
            currentPage:                1,
            totalItems:                 0,
            perPage:                    5,
            term:                       "",
            isBusy:                     false,
            formPage:                   false,
            Tables:                     true,
            ServiceName:                {},
            EndPoint:                   "",
            Adaptor:                    "",
            Adapter:                    "",
            MessageForm:                "",
            StatusSave:                 "",
            loadingSave:                false
        }
    },
    components: {
        Multiselect
    },
    methods: {
        SelectedPage() {
            // window.console.log(this.currentPage);
            this.GetDataBackendService(this.currentPage,this.perPage,this.term);
        },
        AddBackendService() {
            this.formPage               =           true;
            this.Tables                 =           false;
            this.StatusSave             =           "add";
            this.FindService();
        },
        SearchFilter() {
            this.GetDataBackendService(this.currentPage,this.perPage,this.term);
        },
        EditBackendService(data) {
            this.ServiceName            =           {
                serviceName:            data.serviceName
            }
            this.EndPoint               =           data.endPoint;
            this.Adaptor                =           data.adaptor;
            this.Adapter                =           data.adapter;
            this.StatusSave             =           "edit";
            this.AddBackendService();
        }, 
        DeleteBackendService(data) {
            this.StatusSave         =           "delete";
            let question             =           confirm("Are you sure Delete " +data.serviceName+" ?");
            if (question == true) {
                return new Promise(() => {
                    let DataSend            =        {
                        serviceName:            data.serviceName
                    }
                    BackendService.SendDataBackEndService(DataSend,this.StatusSave)
                    .then((result) => {
                        // window.console.log(result);
                        if (result.status == 201) {
                            this.$bvToast.show('message-form', {
                                autoHideDelay: 5000
                            });
                            this.MessageForm        =       result.data.message;
                            this.GetDataBackendService(this.currentPage,this.perPage,this.term);
                            
                        } else {
                            this.$notify({
                                group:      "notif",
                                title:      "Failed Delete "+data.serviceName,
                                text:       "Can't access server",
                                type:       "error",
                                duration:   5000
                            });
                        }
                    });
                });
            }
            // window.console.log(data);
        },
        CloseSave() {
            this.formPage               =           false;
            this.Tables                 =           true;
            this.ServiceName            =           {};
            this.EndPoint               =           "";
            this.Adaptor                =           "";
            this.Adapter                =           "";
        },
        FindService() {
            return new Promise(() => {
                BackendService.GetApiService("")
                .then((result) => {
                    if (result.status == 201) {
                        this.ServiceData     =      result.data.data;
                    } else {
                        let Message          =      "";
                        if (result.statusText == undefined) {
                            Message          =      "No Internet access";
                        } else {
                            Message          =      result.statusText;
                        }
                        this.$notify({
                            group:      "notif",
                            title:      "Failed Get Service ",
                            text:       Message,
                            duration:   5000
                        });
                    }
                    // window.console.log(result);
                });
            });
        },
        Save() {
            // window.console.log(this.ServiceName);
            if (this.ServiceName.serviceName ==  undefined) {
                this.$bvToast.show('message-form', {
                    autoHideDelay:  5000
                });
                this.MessageForm            =        "Service Name Empty";
            } else if (this.EndPoint == "") {
                this.$bvToast.show('message-form', {
                    autoHideDelay:  5000
                });
                this.MessageForm            =       "End Point Empty";
            } else if (this.Adaptor == "") {
                this.$bvToast.show('message-form', {
                    autoHideDelay:  5000
                });
                this.MessageForm            =       "Adaptor Empty";
            } else if (this.Adapter == "") {
                this.$bvToast.show('message-form', {
                    autoHideDelay:  5000
                });
                this.MessageForm            =       "Adapter Empty";
            } else {
                let SendData            =        {
                    serviceName:            this.ServiceName.serviceName,
                    endPoint:               this.EndPoint,
                    adaptor:                this.Adaptor,
                    adapter:                this.Adapter,
                }
                this.loadingSave            =       true;
                return new Promise((resolve, reject) => {
                    BackendService.SendDataBackEndService(SendData,this.StatusSave)
                    .then((result) => {
                        let Message         =       ""
                        if (result.status == 201) {
                            Message         =       result.data.message;
                        } else {
                            Message         =       "Failed Save"+ this.ServiceName.serviceName;
                        }
                        this.$bvToast.show('message-form', {
                            autoHideDelay: 5000
                        });
                        this.loadingSave            =       false;
                        this.MessageForm            =       Message;
                        this.CloseSave();
                        this.GetDataBackendService(this.currentPage = 1,this.perPage = 5,this.term);
                        resolve(result);
                    })
                    .catch((error) => {
                        this.loadingSave            =       false;
                        reject(error);
                    });
                });
                // window.console.log(SendData);
            }
        },
        GetDataBackendService(currentPage,perPage,term) {
            this.isBusy                     =           true;
            return new Promise((resolve, reject) => {
                BackendService.GetBackendService(currentPage,perPage,term)
                .then((result) => {
                    // window.console.log(result);
                    if (result.status == 201) {
                        this.items                  =        [];
                        this.fields                 =        [];
                        this.isBusy                 =        false;
                        this.totalItems             =        result.data.count;
                        // this.currentPage            =        result.data.offset;
                        // this.items                  =        result.data.data;
                        for (let i = 0; i < result.data.data.length; i++) {
                            this.items.push({
                                adapter:            result.data.data[i].adapter,
                                adaptor:            result.data.data[i].adaptor,
                                endPoint:           result.data.data[i].endPoint,
                                serviceName:        result.data.data[i].serviceName,
                                actions:            result.data.data[i].serviceName
                            });
                        }
                        // window.console.log(this.items);
                        resolve(result);
                    } else {
                        let Message                 =        "";
                        if (result.statusText == undefined) {
                            Message                 =        "Can't Access ";
                        } else {
                            Message                 =        result.data.message;
                        }
                        this.isBusy                 =       false;
                        this.$notify({
                            group:          "notif",
                            title:          "Error",
                            text:           Message,
                            type:           "error",
                            duration:       5000
                        });
                        reject("error");
                    }
                    // window.console.log(result);
                }).catch(() => {
                    reject("error");
                });
            });
        },
    },
    watch: {
        currentPage: {
            handler: function(value) {
                if (!isNullOrUndefined(value)) {
                    this.GetDataBackendService(this.currentPage,this.perPage,this.term).catch(() => {});
                }
            }
        }
    },
    created() {
        this.GetDataBackendService(this.currentPage,this.perPage,this.term);
    }
}
</script>

<style lang="css">
    
</style>