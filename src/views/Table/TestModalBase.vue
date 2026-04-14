<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./TestModalBase.vue').default"
        :btnText="`Code TestModalBase [${level}]`"></raw-loader>
    <h4>This is Tpl</h4>
    level : {{ level }}<br>
    <button @click="onAdd()">Add</button>
    <ul>
      <li v-for=" x in hss " :key="x.Id">
        {{ x }}
        <button @click="onEdit(x)">Edit</button>
      </li>
    </ul>
    <ModalBase
        title="Modal Base" 
        size="md" 
        ref="modal" 
        v-model="obj" 
        :listFields="[
          { key: 'Id', label: 'ID' },
          { key: 'Ten', label: 'Tên' },
          // { key: 'Ngay', label: 'Ngày' },
          // { key: 'Tien', label: 'Tiền' },
          // { key: 'Loai', label: 'Loại' },
        ]" 
        @save="onSave"
    >
      <!-- <BTableNhatKy2
        :MonQuyCachs="getMonQuyCachCombo()"
        :PhieuNXId="obj_phieu_nhap_xuat.Id"
        v-model="ct"
        ref="ct"
      ></BTableNhatKy2> -->
    </ModalBase>  

  </div>
</template>

<script>
import ModalBase from './Com_2/ModalBase.vue';


export default {
  name: 'HomeView',
  components: {
    ModalBase
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user') || '{}')
    },
    level() {
      return this.user.level || 0
    }
  },
  mounted(){
    //this.$refs.modal.open();
  },
  data(){
    return{
      obj:{},
      hss:[
        {Id:1,Ten:'Thuc 101'},
      ]
    }
  },
  methods:{
    onSave(){
      let x = {...this.obj};
      if(x.Id==0){
        x.Id=new Date().getTime();
        this.hss.push(x);
      }else{
        let obj=this.hss.find(a=>a.Id==x.Id);
        if(obj){
          obj.Ten=x.Ten;
        }
      }
      this.$refs.modal.close()

    },
    onEdit(x){
      this.obj={...x};
      this.$refs.modal.open();
    },
    onAdd(){
      this.obj={
        Id:0,
        Ten:'thuc xxxx'
      };
      this.$refs.modal.open();
    }

  },


}
</script>
