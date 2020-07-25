<template>
    <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="content">
            <transition name="slide-fade">
                <div>
                    <div class="form-data">
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <label for="">Participant</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <select v-model="Participant" class="Participant">
                                            <option value="">Select</option>
                                            <option value="T24">T24</option>
                                            <option value="Igate">Igate</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <label for="">File</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <div class="">
                                        <div class="file-form">
                                            <!-- <input type="text" placeholder="Placeholder">
                                            <b-button v-b-tooltip.hover title="Cari">
                                                <i class="fas fa-search"></i>
                                            </b-button> -->
                                            <b-form-file class="file-drop" v-model="fileUpload" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..."></b-form-file>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <label for="">Reconciliation Date</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <input type="date" v-model="ReconciliationDate" class="ReconciliationDate">
                                    </div>
                                </div>
                            </div>
                            <div class="upload">
                                <div class="fieldset">
                                    <button class="button" style="color: white; background-color: #6c757d;" @click="Upload()">Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="tableview">
                        <div class="title-table">
                            <p>Preview</p>
                            <div class="progress-upload">
                                <div id="myProgress">
                                    <div id="myBar"></div>
                                </div>
                            </div>
                        </div>
                        <div class="tables-result" >
                            <b-table :fields="fields" show-empty :current-page="currentPage" :busy="isBusy" :per-page="perPage" :items="items" :responsive="true">
                                <b-button v-b-tooltip.hover title="Edit">
                                    <i class="fas fa-edit"></i>
                                </b-button>
                                <template v-slot:table-busy>
                                    <div class="text-center text-danger my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong> Loading...</strong>
                                    </div>
                                </template>
                            </b-table>
                            <b-pagination align="center" v-model="currentPage" :total-rows="rows" :per-page="perPage" size="sm" aria-controls="my-table"></b-pagination>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import FunctionService from '../service/FunctionService';
import ReconiliationService from '../service/ReconciliationService';
// import { VueCsvImport } from 'vue-csv-import'

export default {
    data() {
        return {
            fields:             [],
            items:              [],
            Data:               [],
            Participant:        '',
            ReconciliationDate: '',
            currentPage:        1,
            totalItems:         0,
            perPage:            5,
            tableview:          false,
            fileUpload:         null,
            DataImport:         [],
            isBusy:             false
        }
    },
    methods: {
        Upload() {
            this.fields                 =       [];
            this.items                  =       [];
            if (this.Participant == '') {
                this.tableview          =       false;
                return FunctionService.notifyForm('Participant','Plesse Select Participan','info');
            } else if (FunctionService.CheckExtention(this.fileUpload) == true) {
                FunctionService.ReadCsv(this.fileUpload)
                .then((result) => {
                    let objData         =       [];
                    for (let i = 0; i < result.data.length; i++) {
                        var     obj         =       {};
                        for (let j = 0; j < result.data[i].length; j++) {
                            this.fields.push({
                                key:        result.data[0][j],
                                label:      result.data[0][j].replace(/\./g,' '),
                                sortable:   true,
                                class:      'table-set'
                            });
                            for (let k = 0; k < result.data[i][j].length; k++) {
                                obj[result.data[0][j]]         =    result.data[i][j];
                            }
                        }
                        objData.push(obj);
                    }
                    this.items               =       objData;
                    // window.console.log(objData);
                    this.DataImport          =       result.data;
                    this.tableview           =       true;
                });
                this.SendFile();
            } else {
                alert("file must csv");
            }
        },
        SendFile() {
            let FormSend        =       new FormData();
            FormSend.append("file", this.fileUpload);
            if (this.Participant == 'T24') {
                ReconiliationService.UploadT24(FormSend)
                .then((result) => {
                    window.console.log(result);
                });
            }
        }
    },
    computed: {
        rows() {
            return this.items.length;
        }
    },
    mounted: function() {
        this.Data        =       [];
        this.Data.push();
    }
}
</script>

<style lang="css" scoped>
    .fieldset label {
        width: 100% !important;
    }
    .tables-result .table thead tr .table-set {
        text-transform: lowercase;
    }
    .title-table {
        position: relative;
        right: 7px;
    }
    .title-table p {
        margin-left: 0;
        font-size: 1.0em;
    }
    .fieldset .file-form {
        width: 100%
    }
    .fieldset .file-form button {
        color: white;
        background-color: #6c757d;
        width: 32%;
        position: absolute;
        bottom: 24px;
        height: 36px;
        width: 46px;
    }
    .file-drop {
        width: 254px;
        margin-top: 5px;
    } 
    .upload {
        position: relative;
        right: 18px;
        width: 100%;
        text-align: right;
    }

    @media only screen and (max-width: 992px) {
        .fieldset .file-form button {
            top: 27px;
        }
        .file-drop {
            width: 100%;
            margin-top: 5px;
        } 
    }
</style>