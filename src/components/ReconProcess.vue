<template>
    <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="content">
            <header>
                <h2>Reconciliation Process</h2>
            </header>
            <transition name="slide-fade">
                <div>
                    <div class="form-data">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <div class="search-partner">
                                        <input type="text" placeholder="Search By Partner ID">
                                        <!-- <span class="placeholder">Search By Partner ID</span>
                                        <i class="fa fa-search placeholder" aria-hidden="true"></i> -->
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <input type="date">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <div class="file-form">
                                            <input type="text" placeholder="Filename">
                                            <b-button v-b-tooltip.hover title="Cari">
                                                <i class="fas fa-search"></i>
                                            </b-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table result">
                        <b-table :fields="fields" :items="items" show-empty :per-page="perPage">
                            <template v-slot:cell(actions)="">
                                <div>
                                    <a  href="#">Download</a>
                                    <!-- <a v-if="!data.item.download" href="#">Download</a> -->
                                </div>
                            </template>
                        </b-table>
                        <b-pagination align="center" :total-rows="totalItems" :per-page="perPage" size="sm" aria-controls="my-table"></b-pagination>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fields:         [
                {
                    key:        "filename",
                    label:      "T24 Filename",
                    sortable:   true
                },
                {
                    key:        "Size",
                    label:      "Size",
                    sortable:   true
                },
                {
                    key:        "igatename",
                    label:      "Igate Filename",
                    sortable:   true
                },
                {
                    key:        "sizes",
                    label:      "Size",
                    sortable:   true
                },
                {
                    key:        "date",
                    label:      "Created Date",
                    sortable:   true
                },
                {
                    key:        "actions",
                    label:      "Actions",
                }
            ],
            items:                  [],
            currentPage:            1,
            totalItems:             0,
            perPage:                5,
        }
    },
    methods: {

    },
    mounted: function() {
        for (let i = 1; i <= 2; i++) {
            this.items.push({
                filename:       "T24_20200624.csv",
                Size:           "2 mb",
                igatename:      "Igate_20200624.csv",
                sizes:          "3 mb",
                date:           ""+i+++"/12/2020",
                download:       true,
                actions:        ""
            });
        }
        this.totalItems         =       this.items.length;
    }
}
</script>

<style lang="css" scoped>
    .form-data {
        position: relative;
        margin-left: 5px;
        padding-top: 26px;
    }
    .form-data .search-partner input {
        width: 100%;
    }
    .form-data .search-partner i {
        position: absolute;
        top: 11px;
        left: 12px;
        color: grey;
    }
    .form-data .search-partner {
        position: relative;
    }
    input:focus ~ .placeholder, .input:valid ~ .placeholder {
        display: none;
    }
    .form-data .search-partner .placeholder {
        position: absolute;
        top: 8px;
        left: 33px;
        font-size: 0.9em;
        z-index: 0;
        color: gray;
        cursor: pointer;
    }
    .form-data .search-partner .placeholder:hover {
        display: none;
    }
    .form-data .search-partner .fa-search {
        left: 14px;
        top: 12px;
    }
    .form-group input {
        width: 100%;
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

    @media only screen and (max-width: 992px) {
        .fieldset .file-form button {
            top: 27px;
        }
    }
</style>