<template>
    <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="content">
            <header>
                <h2>Activity History</h2>
            </header>
            <transition name="slide-fade">
                <div>
                    <b-col sm="6" class="my-1">
                        <b-form-group>
                            <b-input-group size="sm">
                                <b-form-input
                                v-model="term"
                                v-on:keyup.enter="GetAllActivityHistory()"
                                type="search"
                                id="filterInput"
                                placeholder="Type to Search"
                                ></b-form-input>
                                <b-input-group-append>
                                <b-button v-b-tooltip.hover title="Search" @click="GetAllActivityHistory()">
                                    <i class="fas fa-search"></i>
                                </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                    <div class="col-sm-12">
                        <b-table show-empty :fields="fields" :items="items" :current-page="currentPage" :busy="isBusy" :per-page="perPage">
                            <template v-slot:table-busy>
                                <div class="text-center text-danger my-2">
                                    <b-spinner class="align-middle"></b-spinner>
                                    <strong>Loading...</strong>
                                </div>
                            </template>
                        </b-table>
                        <b-pagination align="center" v-model="currentPage" :total-rows="rows" :per-page="perPage" size="sm" aria-controls="my-table"></b-pagination>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import ActivityService from '../service/ActivityService'
export default {
    data() {
        return {
            currentPage:     1,
            perPage:         5,
            totalItems:      0,
            isBusy:          false,
            term:            "",
            fields:          [],
            items:           []
        }
    },
    methods: {
        GetAllActivityHistory() {
            this.isBusy         =       true;
            this.fields         =       [
                {
                    key:        "ActivityType",
                    label:      "Activity Type",
                    sortable:   true,
                    class:      "table-set"
                },
                {
                    key:        "CreatedDate",
                    label:      "Created Date",
                    sortable:   true,
                    class:      "table-set"
                },
                {
                    key:        "From",
                    label:      "From",
                    sortable:   true,
                    class:      "table-set"
                },
                {
                    key:        "IpAddress",
                    label:      "Ip Address",
                    sortable:   true,
                    class:      "table-set",
                },
                {
                    key:        "To",
                    label:      "To",
                    sortable:   true,
                    class:      "table-set"
                }
            ];
            ActivityService.GetActivityService(this.term)
            .then((result) => {
                if (result.status == 201) {
                    window.console.log(result);
                    this.totalItems     =    result.data.data.length;
                    this.items          =    result.data.data;
                    this.isBusy         =    false;
                } else {
                    this.isBusy         =    false;
                    this.$notify({
                        group:   "notif",
                        type:    "success",
                        title:   "Info: ",
                        text:    "Failed Get Data Activity"
                    });
                }
            });
        }
    },
    computed: {
        rows() {
            return this.items.length;
        }
    },
    mounted: function() {
        this.GetAllActivityHistory();
    }
}
</script>

<style lang="css" scoped>
    
</style>