<template>
  <b-container fluid>
    <!-- User Interface controls -->

    <div v-if="showData">
      {{ items }}
    </div>
    <b-table 
      :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter"
      :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection" 
      show-empty small bordered outlined
      striped 
      stacked="md" @filtered="onFiltered">

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
            <!-- {{ value }} -->
          </template>
          <template v-else-if = " key == 'DonGia' ">
            <b-form-input autocomplete="off" v-model="sel[key]" :name="key" v-validate="'required'" placeholder=""
              :class="{ 'ko-hop-le': errors.has(key), 'text-center': true }">
            </b-form-input>
          </template>
          <template v-else-if = " key == 'TonKho' ">
            <b-form-input autocomplete="off" v-model="sel[key]" :name="key" v-validate="'required'" placeholder=""
              :class="{ 'ko-hop-le': errors.has(key), 'text-center': true }">
            </b-form-input>
          </template>

          <template v-else-if="key == '_Tien'">
            {{ value }}-hello
          </template>
          <template v-else-if="key == 'Ngay'">
            <b-form-datepicker v-model="sel[key]" :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }" locale="vi" class="">
            </b-form-datepicker>
          </template>
          <template v-else-if = " key == 'Tien' ">
            <b-form-input autocomplete="off" v-model="sel[key]" :name="key" v-validate="'required'" placeholder=""
              :class="{ 'ko-hop-le': errors.has(key), 'text-center': true }">
            </b-form-input>
          </template>
          <template v-else-if="key == '_Done'">
            <b-form-checkbox class="my-checkbox" v-model="sel[key]" :name="key" :value=true
              :unchecked-value=false></b-form-checkbox>
          </template>
          <template v-else-if="key == '_MonId'">
            <v-select :clearable="false" v-model="sel[key]" v-validate="'required'" :name="key"
              :reduce="(option) => option.id" :options="monAns" :has-error="errors.has(key)"
              :class="{ danger: errors.has(key) }" />
          </template>
          <!--Row edit default-->
          <template v-else>
            <b-form-input autocomplete="off" v-model="sel[key]" :name="key" v-validate="'required'" placeholder=""
              :class="{ 'ko-hop-le': errors.has(key), 'text-center': false }">
            </b-form-input>
          </template>
          <!--Row edit default-->
        </template>
      </template>

      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <!-- <template #cell(actions)="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template> -->

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

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <b-row>

      <b-col md="2" lg="1" class="my-1">
        <button @click="onAdd()">Add</button>
      </b-col>

      <b-col md="10" lg="3" class="my-1">
        <b-form-group label="Filter" label-for="filter-input" label-cols-sm="3" label-align-sm="right" label-size="sm"
          class="mb-0">
          <b-input-group size="sm">
            <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Type to Search"></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" lg="5" class="my-1">
        <b-form-group label="Per page" label-for="per-page-select" label-cols-sm="6" label-cols-md="4" label-cols-lg="3"
          label-align-sm="right" label-size="sm" class="mb-0">
          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
        </b-form-group>
      </b-col>

      <b-col md="6" lg="3" class="my-1">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm"
          class="my-0"></b-pagination>
      </b-col>

    </b-row>

    <!-- <b-row>
      <b-col>1</b-col>
      <b-col>2</b-col>
      <b-col>3</b-col>
      <b-col>4</b-col>
    </b-row> -->


    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import { hoaDonService } from '@/db/hoaDonService';
export default {
  data() {
    return {

      Service:hoaDonService,
      showData:false,

      sel: {},
      add: false,
      edit: false,

      isPagingDisabled: false,
      isPerPageDisabled: false,
      isFilterDisabled: false,

      rec: {
        Id: 0,
        Ngay:new Date(),
        TenKhach: 'Cơm sườn',
        Tien:30000,
        //[ { "Ngay": "2026-04-04T03:45:09.346Z", "TenKhach": "Vina milksfsf", "Tien": 10000, "Id": 1 } ] 
      },


      items: [
        { Id: 1, Ten: 'teo' },
        { Id: 2, Ten: 'ti' },
        { Id: 3, Ten: 'vu' },
      ],
      fields: [

        { key: 'STT', label: 'STT', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
        { key: 'Id', label: 'Id', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
        { key: 'TenKhach', label: 'TenKhach', class: "text-left", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "50%" } },
        { key: 'Ngay', label: 'Ngay', class: "text-center", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "10%" },formatter:'fmtDate' },
        { key: 'Tien', label: 'Tien', class: "text-center", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "10%" } , formatter: v => Number(v).toLocaleString('vi-VN') },
        { key: 'actions', label: 'Actions', class: "text-center", thClass: "text-center", tdClass: "align-middle", thStyle: { width: "20%" } }

      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      }
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  async mounted() {
    this.items= await this.Service.getAll();
    this.totalRows = this.items.length
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async onAdd() {
      if (this.add || this.edit) return

      this.add = true
      this.sel = { ...this.rec };

      this.items = [this.sel, ...this.items]

      this.currentPage = 1;
    },
    onEdit(item) {
      if (this.add || this.edit) return
      this.sel = { ...item }
      this.edit = true
    },
    async onCancel() {
      this.add = false;
      this.sel = {};
      this.edit = false;
    },
    async onDel(item) {
      if (this.add || this.edit) return
      let index = this.items.findIndex(a => a.Id == item.Id);
      this.items.splice(index, 1);
    },

    async onUpdate() {
      
      let result = await this.$validator.validateAll();
      if (!result) {
        this.toast(`Dữ liệu không hợp lệ`);
        return;
      }

      const r = { ...this.sel }
      if (r.Id == 0) {
        let {Id,...newr} = r;
        newr=await this.Service.add(newr);
        let index = this.items.findIndex(a => a.Id == 0)
        this.$set(this.items, index, newr);
      } else {
          await this.Service.update(r)
          let index = this.items.findIndex(a => a.Id == r.Id);
          if (index >= 0) this.$set(this.items, index, r);
      }
      this.currentPage = 1;
      this.add = false;
      this.sel = {};
      this.edit = false;
      
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