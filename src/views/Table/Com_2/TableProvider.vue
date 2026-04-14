<template>
    <b-container fluid>

        <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./TableProvider.vue').default"
            :btnText="`Code TableProvider [${level}]`"></raw-loader>
        
        <div v-if="showData">
            {{ cacheItems }}  
        </div>  

        <b-table 
            ref="mytable" 
            :items="myProvider" 
            :fields="fields" 
            :total-rows="totalRows" 
            :per-page="perPage"
            :current-page.sync="currentPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" 
            small
            bordered 
            outlined
            striped
            stacked="md"

            >
            <!-- STT -->
            <template #cell(STT)="data">
                {{ data.index + 1 }}
            </template>
            <template v-slot:cell()="{ value, item, field: { key } }">
                <!--row view-->
                <template v-if="sel.Id != item.Id">
                    <template v-if="item['Id'] != 0">
                        <template v-if="key == 'Done'">
                            <input type="checkbox" :checked="(value == true) ? true : false" :disabled="true" />
                        </template>
                        <!--Row view default-->
                        <template v-else>
                            {{ value }}
                        </template>
                        <!--Row view default-->
                    </template>
                </template>

                <!--row edit-->
                <template v-if="(sel.Id == item.Id || item.Id == 0)">
                    <template v-if="key == 'Id'">
                        {{ value }}
                    </template>
                    <template v-else-if="key == '_Tien'">
                        {{ value }}-hello
                    </template>
                    <template v-else-if="key == '_Ngay'">
                        <b-form-datepicker v-model="sel[key]" :date-format-options="{
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                        }" locale="vi" class="">
                        </b-form-datepicker>
                    </template>
                    <template v-else-if="key == '_Done'">
                        <b-form-checkbox class="my-checkbox" v-model="sel[key]" :name="key" :value=true
                            :unchecked-value=false></b-form-checkbox>
                    </template>
                    <template v-else-if="key == '_MonId'">
                        <v-select :clearable="false" v-model="sel[key]" v-validate="'required'" :name="key"
                            :reduce="(option) => option.id" 
                            :options="monAns" 
                            :has-error="errors.has(key)" :class="{ danger: errors.has(key) }" />
                    </template>
                    <!--Row edit default-->
                    <template v-else>
                        <b-form-input autocomplete="off" v-model="sel[key]" :name="key" v-validate="'required'"
                            placeholder="" :class="{ 'ko-hop-le': errors.has(key), 'text-center': false }">
                        </b-form-input>
                    </template>
                    <!--Row edit default-->
                </template>
            </template>
            <!-- ACTION -->
            <template #cell(actions)="row">
                <template v-if="sel.Id !== row.item.Id">
                    <button class="mr-1" @click="onEdit(row.item)">Edit</button>
                    <button class="mr-1" @click="onDel(row.item)">Del</button>
                </template>
                <template v-else>
                    <button class="mr-1" @click="onUpdate()">
                        {{ sel.Id ? 'Update' : 'Add' }}
                    </button>
                    <button @click="onCancel()">Cancel</button>
                </template>
            </template>
        </b-table>
        <b-row class="mt-2">
            <b-col>
                <div class="d-flex flex-column flex-md-row align-items-md-center">

                    <!-- Add -->
                    <b-button @click="onAdd" variant="primary" class="mb-2 mb-md-0 mr-md-3">
                        Add
                    </b-button>

                    <!-- Search -->
                    <b-input-group class="mb-2 mb-md-0 mr-md-3" style="max-width: 300px;">
                        <b-form-input v-model="filter" placeholder="Search..." />
                        <b-input-group-append v-if="filter">
                            <b-button @click="onClear" variant="outline-secondary">✕</b-button>
                        </b-input-group-append>
                    </b-input-group>

                    <!-- Per page -->
                    <div class="d-flex align-items-center mb-2 mb-md-0 mr-md-3">
                        <span class="mr-2">Per page:</span>
                        <b-form-select v-model="perPage" :options="[3, 5, 10]" style="width: 80px;" />
                    </div>

                    <!-- Pagination -->
                    <b-pagination class="ml-md-auto" v-model="currentPage" :total-rows="totalRows"
                        :per-page="perPage" />

                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
//import { taBiLuService } from '@/db/taBiLuService';
import { hoaDonService } from '@/db/hoaDonService';
export default {
    computed: {
        user() {
            return JSON.parse(localStorage.getItem('user') || '{}')
        },
        level() {
            return this.user.level || 0
        }
    },
    data() {
        return {
            Service: hoaDonService, //taBiLuService,
            showData:false,

            sel: {},
            add: false,
            edit: false,

            isPagingDisabled: false,
            isPerPageDisabled: false,
            isFilterDisabled: false,

            cacheItems: [],

            rec: {
                Id: 0,
                Ngay: new Date(),
                TenKhach: 'thuc 101',
                Tien: 30000,
                Done: true,
                MonId: 1,
            },

            fields: [
                { key: 'STT', label: 'STT', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
                { key: 'Id', label: 'Id', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
                { key: 'TenKhach', label: 'Tên khách', class: "text-left", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "70%" } },
                { key: 'actions', label: 'Actions', class: "text-center", thClass: "text-center", tdClass: "align-middle", thStyle: { width: "20%" } }
            ],
            totalRows: 0,
            currentPage: 1,
            perPage: 3,

            sortBy: '',
            sortDesc: false,
            filter: null,
            
            monAns:[
                { id: 1, label: 'Đường' },
                { id: 2, label: 'Sữa' },
                { id: 3, label: 'Bột' },
            ],

        }
    },

    methods: {

        // ================= PROVIDER =================
        async myProvider(ctx) {
            let res = await this.Service.getPagingCursor({
                page: ctx.currentPage,
                pageSize: ctx.perPage,
                keyword: ctx.filter
            })
            this.totalRows = res.total
            let data = res.items
            data = data.sort((a, b) => b.Id - a.Id)
            if (this.add) {
                data = [this.rec, ...data]
                this.sel = { ...this.rec }
            }
            this.cacheItems = data
            return data
        },

        // ================= ADD =================

        async onAdd() {
            if (this.add || this.edit) return

            this.add = true
            await this.$refs.mytable.refresh()
            this.currentPage = 1;
        },

        // ================= EDIT =================
        onEdit(item) {
            if (this.add || this.edit) return
            this.sel = { ...item }
            this.edit = true
        },

        // ================= DELETE =================
        async onDel(item) {
            if (this.add || this.edit) return
            await this.Service.delete(item.Id)
            await this.$refs.mytable.refresh()
        },

        // ================= SAVE =================

        async onUpdate() {
            let result = await this.$validator.validateAll();
            if (!result) {
                this.toast(`Dữ liệu không hợp lệ`);
                return;
            }

            const r = { ...this.sel }
            if (r.Id == 0) {
                const { Id, ...newr } = r
                await this.Service.add(newr)
            } else {
                await this.Service.update(r)
            }
            await this.$refs.mytable.refresh()
            this.currentPage = 1;
            this.add = false;
            this.sel = {};
            this.edit = false;
        },

        // ================= CANCEL =================
        async onCancel() {
            await this.$refs.mytable.refresh();
            this.add = false;
            this.sel = {};
            this.edit = false;
        },

        // ================= RESET =================
        resetState() {
            this.sel = {}
            this.add = false
            this.edit = false
        },

        NgayFormat(date) {
            if (!date) return ''
            const d = new Date(date)
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const year = d.getFullYear()
            return `${day}/${month}/${year}`
        },
        TienFormat(tien) {
            return `${Number(tien).toLocaleString()} đ`
        },
        async onClear() {
            this.filter = null
            this.currentPage = 1
            await this.$refs.mytable.refresh()
        },
        
        toast(msg, variant = null) {
            this.$bvToast.toast(msg, {
                title: `Information`,
                variant: variant,
                solid: true,
            });
        },
        fmtDate(v) {
            if (!v) return ''
            const d = new Date(v)
            return `${d.getDate().toString().padStart(2,'0')}/${
            (d.getMonth()+1).toString().padStart(2,'0')
            }/${d.getFullYear()}`
        }        

    }
}
</script>