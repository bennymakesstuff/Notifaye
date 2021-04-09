<template>
    <div class="notification">
      <div class="title">{{this.$props.data.title}} - {{this.$props.data.noteid}}</div>
      <div class="title" v-if="static">Static Notification<span @click="removeEarly">X</span></div>
      <div class="content">{{this.$props.data.content}}</div>
      <div class="content">{{this.$props.data.timeout}}</div>
    </div>
</template>

<script>
// Currently separating the note from the note area
// Timers will be managed on the object in the state.


export default {
  name: 'note',
  data: function(){
    return {
    }
  },
  props: {
    data: {
      type: Object
    },
    queue: {
      type: String
    }
  },
  mounted(){
    //Start a timer against the state object
    this.startTimer();
  },
  computed: {
    static: function(){
      return (this.$props.data.static==true)?true:false;
    }
  },
  methods: {
    startTimer: function(){
      //Possibly move the static logic into the index file on the $notify object so that even if the function is called the object manages it.
      this.$notify.startTimer(this.queue, this.data.noteid);

    },
    pauseTimer: function(){

    },
    extendTimer: function(){

    },
    removeEarly: function(){
      console.log('Remove Early');
      this.$notify.removeNotification(this.queue, this.data.noteid);
    }
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
