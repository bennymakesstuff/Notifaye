<template>
    <div class="notification-area">
      <h1>{{list.queueName}}</h1>
      <Note v-for="note in list.notifications" :queue="list.queueName" :data="note" :key="list.queueName+'-'+note.noteid"/>
    </div>
</template>

<script>
import Note from './note.vue';

export default {
  name: 'notifyToast',
  components: {
    Note
  },
  data: function(){
    return {
    }
  },
  props: {
    list: {
      type: Object
    }
  },
  mounted(){
    console.log(this.$props.list);
  },
  computed: {

  },
  methods: {
    startTimer: function(){

    },
  }
}
</script>

<style lang="scss" scoped>
  h1 {font-size: 2rem;}

  @keyframes slide-up {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

  .notification-area {position: fixed;
                      bottom: 0;
                      right: 0;
                      padding: 0.25rem;
                      background-color: transparent;
                      height: auto;
                      width: 20rem;
                      transition: height 0.4s ease;
                      z-index:100;


                      > .notification {margin: 0.5rem;
                                      background-color: #ffffff;
                                      border-radius: 0.25rem;
                                      box-shadow: 0px 1px 3px 3px rgba(#393939, 0.17);
                                      animation: slide-up 0.4s ease;
                                      transition: position 0.4s ease;

                            > .title {font-weight: bold;
                                      line-height: 0.8rem;
                                      font-size: 0.8rem;
                                      padding: 0.5rem 0.75rem 0.25rem 0.75rem;}

                            > .content {font-weight: 200;
                                        padding: 0rem 0.75rem 0.5rem 0.75rem;;
                                        line-height: 0.8rem;
                                        font-size: 0.8rem;}

                                      }
                    }
</style>
