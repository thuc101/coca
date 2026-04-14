<template>
  <div>
    <raw-loader v-show="true" :mytxt="require('!raw-loader!./ModalBase.vue').default"
      :btnText="`Code ModalBase`"></raw-loader>

    <b-modal
      ref="modal"
      :title="title"
      :size="size"
      @shown="onShown"
      no-close-on-backdrop
      hide-footer
    >
      <form @submit.stop.prevent="onSave">
        <div  v-for="f in listFields" :key="f.key" class="form-group row p-1">

          <template v-if=" f.key==='Id' ">
            <label class="col-sm-4 col-form-label font-weight-bold">Id</label>
            <div class="col-sm-8">
              <input
                autocomplete="off"
                class="form-control"
                readonly
                v-model="localSel[f.key]"
              />
            </div>
          </template>

          <template v-else-if="f.key === '_Ten'">
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8">
              <input
                autocomplete="off"
                class="form-control"
                v-model="localSel[f.key]"
                :name="f.key"
                v-validate="'required'"
                :class="{ 'ko-hop-le': errors.has(f.key) }"
              />
            </div>
          </template>

          <template v-else-if="f.key === '_Tp'">
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8">
              <v-select
                v-model="localSel[f.key]"
                v-validate="'required'"
                :name="f.key"
                :reduce="(option) => option.id"
                :options="[
                  { label: 'Huế', id: 'HUE' },
                  { label: 'Sài gòn', id: 'SG' },
                  { label: 'Đà nẵng', id: 'DN' },
                  { label: 'Quảng ngãi', id: 'QN' },
                ]"
                :has-error="errors.has(f.key)"
                :class="{ 'is-invalid': errors.has(f.key) }"                
              />
            </div>
          </template>

          <template v-else-if="f.key === '_MonId'">
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8">
              <v-select 
                v-model="localSel[f.key]" 
                v-validate="'required'" 
                :name="f.key" 
                :reduce="(option) => option.id"
                  :options="[
                    { Id:1,Ten: 'Đường' },
                    { Id:2,Ten: 'Sữa' },
                    { Id:3,Ten: 'Bột' },
                  ].map(x=>{
                    return {
                      id:x.Id,
                      label:x.Ten
                    }
                  })" 
                  :has-error="errors.has(f.key)"
                  :class="{ 'is-invalid': errors.has(f.key) }"                
              />
            </div>
          </template>

          <template v-else-if="f.key === '_Loai'">
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8">

              <v-select
                multiple
                v-model="localSel[f.key]"
                :name="f.key"
                v-validate="'required'"
                :options="['admin', 'user', 'guest']"
                :has-error="errors.has(f.key)"
                :class="{ 'is-invalid': errors.has(f.key) }"                
              />


            </div>
          </template>

          <template v-else-if="f.key === '_Ngay'">
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8">
              <b-form-datepicker
                v-model="localSel[f.key]"
                :date-format-options="{
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                }"
                locale="vi"
                class=""
              >
              </b-form-datepicker>
            </div>
          </template>

          <template v-else-if="f.key === '_Act'">
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8 d-flex align-items-center">
              <b-form-checkbox 
                class="my-checkbox" 
                v-model="localSel[f.key]" 
                :name="f.key" 
                value=true 
                unchecked-value=false
              >
              </b-form-checkbox> 
            </div>
          </template>

          <template v-else>
            <label class="col-sm-4 col-form-label font-weight-bold">{{f.label}}</label>
            <div class="col-sm-8">
              <input
                autocomplete="off"
                class="form-control"
                v-model="localSel[f.key]"
                :name="f.key"
                v-validate="'required'"
                :class="{ 'ko-hop-le': errors.has(f.key) }"
              />
            </div>
          </template>

        </div>
        <!-- <slot /> -->
        <div @click.stop class="mb-3" >
          <slot />
        </div>
        <div class="text-right">
          <button type="submit" class="btn btn-primary mr-1">Save</button>
          <button type="button" class="btn btn-secondary"  @click="close" >Cancel</button>
        </div>

      </form>

    </b-modal>

  </div>
</template>

<script>

import VeeValidate from "vee-validate";
import Vue from "vue";
Vue.use(VeeValidate, {
  classes: true,
  fieldsBagName: "veeFields",
});

import moment from "moment";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);

export default {
  name: "ModalBaseAddEdit",
  props: {
    value: {
      type: Object,
      default: null,
    },
    title: String,
    size: {
      type: String,
      default: "md",
    },
    listFields: {
      type: Array,
      default: () => [],
    },


  },
  data() {
    return {
      localSel: {},
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.localSel = val ? { ...val } : {};
      },
    },
  },
  methods: {
    onShown(){
      this.$emit('show')
    },
    open() {
      this.$refs.modal.show();
    },
    close() {
      this.$refs.modal.hide();
    },
    async onSave() {
      let result = await this.$validator.validateAll();
      if (!result) {
        alert(`không đủ dữ liệu!`)
        return;
      }

      this.$emit("input", this.localSel); // 👈 update v-model
      this.$emit("save", this.localSel);  // 👈 callback ngoài

    },

  },
};
</script>

<style>
  .is-invalid .vs__dropdown-toggle {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220,53,69,.25);
  }

</style>
