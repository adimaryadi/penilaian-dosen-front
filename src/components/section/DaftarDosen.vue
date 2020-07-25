<template>
    <div class="col-xs-12 col-sm-12 col-md-9">
        <div class="content">
            <header>
                <h2>Data Dosen</h2>
            </header>
            <transition name="slide-fade">
                <div>
                    <div class="table-selected">
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <label for="" style="width: 100% !important;">Pilih Jurusan</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="form-group">
                                    <div class="fieldset">
                                        <select name="" id="" >
                                            <option value="informatika">Informatika</option>
                                            <option value="sipil">Sipil</option>
                                            <option value="arsitek">Arsitek</option>
                                            <option value="elektro">Elektro</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                            </div>
                            <div class="col-md-9">
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12">
                        <b-table show-empty :items="items" :fields="fields" :busy="isBusy" :current-page="currentPage" :per-page="perPage">
                            
                        </b-table>
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
            items:   [],
            fields:  [
                {
                    key:        "nip",
                    label:      "NIP",
                    sortable:   true
                },
                {
                    key:        "nama",
                    label:      "Nama",
                    sortable:   true
                },
                {
                    key:        "action",
                    label:      "Pilihan"
                }
            ],
            currentPage: 1,
            perPage: 5,
            totalItems: 0,
            details: false,
            term: "",
            isBusy: false,
        }
    },
    methods: {
        
    },
    mounted: function() {
    }
}
</script>

<style lang="scss" scoped>
    
</style>