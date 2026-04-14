<template>
  <div>
    <div>
        <div class="text-right m-1">
          <button @click=" ()=>{this.show=!this.show} " :disabled="false">{{(show==false) ? `Show ${btnText}` : 'Hide' }}</button>
        </div>
        <p v-show=" show ">
          <editor v-model="mytxt" @init="editorInit" lang="html" theme="chrome" width="100%" height="800"></editor>
        </p>
      </div>
    </div>
</template>
<script>
export default {
  //props:["mytxt"],
  props:{
    mytxt:{
      type:String,
      default:'Tpl'
    },
    btnText:{
      type:String,
      default:'Code'
    }
  },
  props_:{
    value: String, // hỗ trợ v-model
    editorId: {
        type: String,
        default: () => `editor-${Math.random().toString(36).substr(2, 9)}`
    }
  },

  name: 'Tpl',
  components:{
    editor: require('vue2-ace-editor'),
  },  
  data(){
    return{
      show:false,
    }
  },
  mounted(){
  },
  methods: {
      editorInit: function (editor) {
          require('brace/ext/searchbox')
          require('brace/ext/language_tools') //language extension prerequsite...
          require('brace/mode/html')                
          require('brace/mode/javascript')    //language
          require('brace/mode/less')
          require('brace/theme/chrome')
          require('brace/snippets/javascript') //snippet
          editor.setOptions({
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "8.5pt"
          });
      }
  },
}
</script>
<style scoped>
  .my-textarea{
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.65rem;
  }
</style>