<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>

      <b-col lg="4" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="5" lg="4" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" lg="4" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>

    </b-row>

    <!-- Main table element -->
    <b-table
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
      bordered 
      outlined
      striped
      @filtered="onFiltered"
    >
      <template #cell(name)="row">
        <!-- {{ row.value.first }} {{ row.value.last }} -->
         {{ row.item.name }} 
      </template>

      <template #cell(actions)="row">
<!--         
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails" class="mr-1">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
        <button class="btn btn-warning btn-sm mr-1">
          ✏️ Edit
        </button>        
        <button class="btn btn-danger btn-sm mr-1">
          🗑️ Delete
        </button>
        <button class="btn btn-info btn-sm mr-1">
          👁️ Detail
        </button>
 -->

        <!-- 
        <button class="mr-1" @click="showAll(row.item)">ShowAll</button> 
        <button @click="hideAll(row.item)">HideAll</button>  
        -->
        <button @click="onTest(row.item)">Details</button>


      </template>

      <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          // {name : 'thuc' , age: 60},
          // {name : 'thuc1' , age: 61},
          {Id:1,Ten:"thuc 101",DonGia:1000},
          {Id:2,Ten:"thuc 102",DonGia:1001},
        ],
        fields: [
          { key: 'Id', label: 'Id', class: "text-left text-md-center", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "10%" } },
          { key: 'Ten', label: 'Tên', class: "text-left", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "60%" } },
          { key: 'DonGia', label: 'Đơn giá', class: "text-left text-md-center", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "10%" } },
          { key: 'actions', label: 'Actions' , class: "text-center", thClass: "text-center", tdClass: "align-middle", thStyle: { width: "20%" } }
          /*
          { key: 'name', label: 'Name', class: "text-left", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "70%" } },
          { key: 'age', label: 'Age', class: "text-left text-md-center", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "10%" } },
          { key: 'actions', label: 'Actions' , class: "text-center", thClass: "text-center", tdClass: "align-middle", thStyle: { width: "20%" } }
          */ 

          /*
                { key: 'STT', label: 'STT', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
                { key: 'Id', label: 'Id', class: "text-center", sortable: true, thClass: "text-left", tdClass: "align-middle", thStyle: { width: "5%" } },
                { key: 'TenKhach', label: 'Tên khách', class: "text-left", sortable: true, thClass: "text-center", tdClass: "align-middle", thStyle: { width: "70%" } },
                { key: 'actions', label: 'Actions', class: "text-center", thClass: "text-center", tdClass: "align-middle", thStyle: { width: "20%" } }
          */

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
      // Set the initial number of items
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
      showAll(item){
        this.items.forEach(x=>{
          this.$set(x,'_showDetails',true)
        })
      },
      hideAll(item){
        this.items.forEach(x=>{
          this.$set(x,'_showDetails',false)
        })

      },
      onTest(item){
        let _showDetails=item._showDetails == undefined || item._showDetails==false ? false : true ;
        //alert(_showDetails)

        this.items.forEach(x=>{
          this.$set(x,'_showDetails',false)
        })
        if(_showDetails){//true
          this.$set(item,'_showDetails',false)
        }else{
          this.$set(item,'_showDetails',true)
        }
      },
      fmtDate(v) {
          if (!v) return ''
          const d = new Date(v)
          return `${d.getDate().toString().padStart(2,'0')}/${
          (d.getMonth()+1).toString().padStart(2,'0')
          }/${d.getFullYear()}`
      },        


    }
  }
</script>