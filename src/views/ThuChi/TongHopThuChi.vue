<template>
  <div>
    <raw-loader v-show="level == 9" :mytxt="require('!raw-loader!./TongHopThuChi.vue').default"
      :btnText="`Code TongHopThuChi [${level}]`"></raw-loader>
    <h4>This is TongHopThuChi</h4>
    level : {{ level }}<br>
    {{ ds }}
  </div>
</template>

<script>
import { thuService } from '@/db/thuService';
import { chiService } from '@/db/chiService';
export default {
  name: 'HomeView',
  components: {
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user') || '{}')
    },
    level() {
      return this.user.level || 0
    }
  },
  async mounted(){
    //this.test();
    this.ds= await this.lds_thuChi()
  },
  data(){
    return{
      ds:[],
    }
  },
  methods: {

    async lds_thuChi(){
      
      const thu= await thuService.getAll();
      const chi= await chiService.getAll();

      // Hàm lấy yyyy-mm-dd
      const getDate = (d) => new Date(d).toISOString().slice(0, 10);

      // Gom dữ liệu
      const result = {};

      thu.forEach(x => {
        const d = getDate(x.Ngay);
        if (!result[d]) result[d] = { Ngay: d, Thu: 0, Chi: 0 };
        result[d].Thu += Number(x.TienThu || 0);
      });

      chi.forEach(x => {
        const d = getDate(x.Ngay);
        if (!result[d]) result[d] = { Ngay: d, Thu: 0, Chi: 0 };
        result[d].Chi += Number(x.TienChi || 0);
      });

      // Convert ra array
      const final = Object.values(result);

      //console.log(JSON.stringify(final,null,2));
      return final;

    },

    async test() {

      const thu= await thuService.getAll();
      const chi= await chiService.getAll();

      // Hàm lấy yyyy-mm-dd
      const getDate = (d) => new Date(d).toISOString().slice(0, 10);

      // Gom dữ liệu
      const result = {};

      thu.forEach(x => {
        const d = getDate(x.Ngay);
        if (!result[d]) result[d] = { Ngay: d, Thu: 0, Chi: 0 };
        result[d].Thu += Number(x.TienThu || 0);
      });

      chi.forEach(x => {
        const d = getDate(x.Ngay);
        if (!result[d]) result[d] = { Ngay: d, Thu: 0, Chi: 0 };
        result[d].Chi += Number(x.TienChi || 0);
      });

      // Convert ra array
      const final = Object.values(result);

      console.log(JSON.stringify(final,null,2));


    }


  }







}
</script>
