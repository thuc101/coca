<template>
  <!-- <b-container fluid @click.stop  > -->
  <div @click.stop  >
    <!-- User Interface controls -->

    <div v-if = "showData">
      {{ localItems }}
    </div>

    <b-table @click.stop ref="mytable" :items="localItems" :fields="fields" :current-page="currentPage" :per-page="perPage"
      :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection" show-empty small bordered outlined 
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
            <template v-else-if= " key == 'Id' " >

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
          <template v-else-if="key == 'Done'">
            <b-form-checkbox class="my-checkbox" v-model="sel[key]" :name="key" :value=true
              :unchecked-value=false></b-form-checkbox>
          </template>
          <template v-else-if="key == 'MonId'">
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
          <button type="button" class="mr-1" @click="onEdit(row.item)">Edit</button>
          <button type="button" class="mr-1" @click="onDel(row.item)">Del</button>
        </template>
        <template v-else>
          <button type="button" class="mr-1" @click="onUpdate()">
            {{ sel.Id ? 'Update' : 'Add' }}
          </button>
          <button type="button" @click="onCancel()">Cancel</button>
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


      <b-col lg="2" class="my-1">
        <button type="button" @click.stop="onAdd()">Add</button>
      </b-col>
      <b-col lg="2" class="my-1">
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

      <b-col sm="5" md="4" class="my-1">
        <b-form-group label="Per page" label-for="per-page-select" label-cols-sm="6" label-cols-md="4" label-cols-lg="3"
          label-align-sm="right" label-size="sm" class="mb-0">
          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="4" class="my-1">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm"
          class="my-0"></b-pagination>
      </b-col>

    </b-row>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </div>
</template>

<script>
export default {

  props: {
    value: Array
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.localItems = val ? [...val] : []
      }
    },
    localItems(val) {
      this.totalRows = val.length
    },
  },

  data() {
    return {
      localItems: [],
      showData:false,

      sel: {},
      add: false,
      edit: false,

      isPagingDisabled: false,
      isPerPageDisabled: false,
      isFilterDisabled: false,

      rec: {
        Id: 0,
        TenKhach: 'thuc 101',
        Tien:111,
      },

      fields: [
        { key: 'STT', label: 'STT', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
        { key: 'Id', label: 'Id', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
        { key: 'TenKhach', label: 'TenKhach', class: "text-left", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "60%" } },
        { key: 'Tien', label: 'Tien', class: "text-center", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "10%" }, formatter: v => Number(v).toLocaleString('vi-VN') },
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
  mounted() {
    this.totalRows = this.localItems.length
  },
  methods: {

    emitChange() {
      this.$emit('input', [...this.localItems])
    },

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

      this.localItems = [this.sel, ...this.localItems]
      this.emitChange()

      this.currentPage = 1;
    },
    onEdit(item) {
      if (this.add || this.edit) return
      this.sel = { ...item }
      this.edit = true
    },

    async onCancel() {
      if (this.add) {
        this.localItems = this.localItems.filter(x => x !== this.sel)
      }

      if (this.$validator) {
        this.$validator.reset()
      }

      this.add = false
      this.sel = {}
      this.edit = false

      this.emitChange()
    },

    async onDel(item) {
      if (this.add || this.edit) return
      this.localItems = this.localItems.filter(x => x.Id !== item.Id)
      this.emitChange()
    },

    async onUpdate() {
      let result = await this.$validator.validateAll();
      if (!result) {
        this.toast(`Dữ liệu không hợp lệ`);
        return;
      }

      const r = { ...this.sel }
      if (r.Id == 0) {
        r.Id = new Date().getTime();
        let index = this.localItems.findIndex(a => a.Id == 0)
        this.$set(this.localItems, index, r)
        this.emitChange()

      } else {
        let index = this.localItems.findIndex(a => a.Id == r.Id);
        if (index >= 0) this.$set(this.localItems, index, r);
        this.emitChange()
      }
      this.currentPage = 1;
      this.add = false;
      this.sel = {};
      this.edit = false;

    },


  }
}
</script>