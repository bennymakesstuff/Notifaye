import Vue from 'vue';
// Notification System for Vue

// The Store that appends to the Global Vuex Store
// The Notification Queue acts in a first in last out fashion
// There might be a potential for it to act in a first in first out fashion by option.


// OUSTADING ISSUE!
// Sometimes the timeout property on a notification is the desired time before the function runs (e.g. 5000ms),
// sometimes it is a reference to the timeout function itself (e.g. timeout #19).
// I need to resolve this issue so it is always clear. That should fix the issue of
// notifications being run instantly and dissapearing when there is a router change and you navigate
// back to the page with the notifications.
// Especially needed where notifications will be on the many pages.


// The Notification Queue can have multiple notification queues and that can all opperate individually.
const convertToQueueName = function(nameToConvert){
  return nameToConvert.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
}

const getIndex = function(haystack, needle){
  for(let i = 0;i < haystack.notifications.length;i++){
    if(haystack.notifications[i].noteid==needle){
      return i;
    }
  }
  return false;
}

// The Vuex Plugin
let notifayeStore = Vue.observable({

  namespaced: true,

  state: () => ({
    verbose: true,
    queues: {
      // Queues contains a "default" queue, by default. More can be added.
      // Default is required for it to function on the beginning.
      // Other queues can be passed in as objects in the options at instantiation
      default: {
        title: 'Default',
        queueName: 'default',
        notificationTimeout: 2000,
        notifications: [],
        queueCounter: 0
      }
    }
  }),


  getters: {
    isVerbose: state => {
        return state.verbose;
    },

    returnQueue: state => queueToUse => {
      return state.queues[queueToUse];
    },

    countQueue: state => queueToUse => {
      return state.queues[queueToUse].notifications.length;
    },

    checkQueueTitleExisits: (state) => (newQueueTitle) => {
      return (!state.queues.hasOwnProperty(newQueueTitle)) ? true : false;
    },

    listQueues: (state) => {
      let queues = [];
      for (var prop in state.queues) {
        queues.push(state.queues[prop]);
      }
      return queues;
    }

  },


  // The reason for default values on the parameters here as well as actions is so that if someone chooses to
  // call a mutation from somewhere other than this module, the defaults are still used when needed.
  mutations: {
    ADD_NOTE (state, notificationData){
      let queueCount = state.queues[notificationData.queueToUse].queueCounter;
      notificationData.note['noteid'] = queueCount + 1;
      if(parseInt(notificationData.note.timeout)<1){
        notificationData.note.static = true;
      }
      state.queues[notificationData.queueToUse].notifications.push(notificationData.note);
      state.queues[notificationData.queueToUse].queueCounter++;
    },

    DESSIMATE_LIST (state, queueToUse = 'default'){
      state.queues[queueToUse].notifications = [];
    },

    DELETE_LAST (state, queueToUse = 'default'){
      state.queues[queueToUse].notifications.pop();
    },

    DELETE_FIRST (state, queueToUse = 'default'){
      state.queues[queueToUse].notifications.shift();
    },

    NEW_QUEUE (state, newQueueConfig){
      // Need to add a function to check for queue title clashes
      newQueueConfig['queueName'] = convertToQueueName(newQueueConfig.title);
      newQueueConfig['queueCounter'] = 0;
      Vue.set(state.queues, newQueueConfig.queueName, newQueueConfig);
    },

    START_TIMER (state, noteSettings){
      if(noteSettings.noteIndex!==false){
        Vue.set(state.queues[noteSettings.queue].notifications[noteSettings.noteIndex], 'timeout', setTimeout(()=>{Vue.prototype.$notifaye.complete(noteSettings.notificationPosition,noteSettings.queue)}, noteSettings.timeout));
      }
      else{
        console.log('Timeout not set');
      }
    },

    DESTROY_NOTIFICATION(state, noteData){
      let noteIndex = getIndex(state.queues[noteData.queue],noteData.notificationIndex);
      if(noteIndex!==false){
        state.queues[noteData.queue].notifications.splice(noteIndex, 1);

        //Check for any remaining notifcations, if none, reset the counter.
        if(state.queues[noteData.queue].notifications.length==0){
          state.queues[noteData.queue].queueCounter = 0;
        }
      }
      else{
        console.log('Could not delete notification');
      }
    }
  },



  actions: {
    // Add a new note to a queue
    add(context, noteData) {
      context.commit('ADD_NOTE', noteData);
    },
    create_note(context, noteData, queueToUse){
      context.commit('ADD_NOTE', noteData, queueToUse);
    },

    // Delete the most recently created note in a queue
    delete_newest(context, queueToUse = 'default') {
      context.commit('DELETE_LAST', queueToUse);
    },

    // Delete the oldest note in a queue
    delete_oldest(context, queueToUse = 'default') {
      context.commit('DELETE_FIRST', queueToUse);
    },

    //Adds a new notification queue to the application
    new_queue({getters, state, context, dispatch}, newQueueConfig) {

      // Check for queue data and queue title clashes
      if(newQueueConfig!=null&&newQueueConfig.title!=null&&getters.checkQueueTitleExisits){

        // Had to dispatch to create_queue here as context kept returning undefined so I could not commit here for some reason
        // Possible fix required.
        dispatch('create_queue',newQueueConfig);
      }
      else{
        console.log('Failed to create new queue');
      }
    },

    // Helper function for the above new_queue function - may be dissolved once above problem is solved.
    create_queue(context, newQueueConfig){
      context.commit('NEW_QUEUE', newQueueConfig);
    },

    // Flush a notification queue
    dessimate(context, queueToUse = 'default') {
      context.commit('DESSIMATE_LIST', queueToUse);
    },

    // Starts the timer in a given notification
    start_timer({state, dispatch}, noteData){
      // Check if the queue and notification exists and if so, check if the notification has its own timeout setting.
      // If not use the timeout setting from the queue.
      if(state.queues.hasOwnProperty(noteData.queueToUse)/*&&typeof state.queues[noteData.queueToUse].notifications[noteData.note] !== 'undefined'*/){
        let noteIndex = getIndex(state.queues[noteData.queueToUse],noteData.note);
        if(noteIndex!==false){
          let notification = state.queues[noteData.queueToUse].notifications[noteIndex];
          console.log('notification');
          console.log(notification);
          if(notification.static===false){
            let timeoutLength = (notification.hasOwnProperty('timeout'))?notification.timeout : state.queues[queueToUse].notificationTimeout;
            dispatch('begin_timeout',{queue:noteData.queueToUse,notificationPosition:noteData.note, noteIndex: noteIndex, timeout:timeoutLength});
          }
        }
        else{
          console.log('Note witht id '+noteData.note+' does not exist');
        }
      }
      else{
        console.log('Note does not exist');
      }
    },

    // Calls the mutation to set a timeout
    begin_timeout(context, noteSettings){
      context.commit('START_TIMER',noteSettings);
    },

    // Removes a notification at a given index (Mainly used on completion)
    delete_specific(context, noteData){
      context.commit('DESTROY_NOTIFICATION', noteData);
    }
  },
});



// The notifaye Vue Plugin Object
let notifaye = {

   // This install function gets triggered when Vue.use() is invoked passing in the plugin.
   install(Vue, store) {

    Vue.prototype.$notifaye = {

      // Vuex Store for Notifications Module
      // You must add Notifications to Module
      store: store,

      // Return the number of notifications in a queue
      count: function(queueToUse = 'default'){
        return this.store.getters['notifaye/countQueue'](queueToUse);
      },

      // Return the notifications in a queue
      notes: function(queueToUse = 'default'){
        if(this.store.getters['notifaye/isVerbose']===true){
          console.table(this.store.getters['notifaye/returnQueue'](queueToUse).notifications);
        }
        return this.store.getters['notifaye/returnQueue'](queueToUse);
      },

      // Lists the Queues available
      listQueues: function(){
        return this.store.getters['notifaye/listQueues'];
      },

      // Adds a notification to a queue
      add: function(notification, queueToUse = 'default'){
        this.store.dispatch('notifaye/add', {note:notification, queueToUse:queueToUse});
      },

      // Creates a New Queue
      newQueue: function(newQueueConfig = null){
        this.store.dispatch('notifaye/new_queue', newQueueConfig);
      },

      // Flushes all notifications from a queue
      dessimate: function(queueToUse = 'default'){
        this.store.dispatch('notifaye/dessimate', queueToUse);
      },

      // Removes the most recent notification from a queue
      removeNewest: function(queueToUse = 'default'){
        this.store.dispatch('notifaye/delete_newest', queueToUse);
      },

      // Removes the oldest notification from a queue
      removeOldest: function(queueToUse = 'default'){
        this.store.dispatch('notifaye/delete_oldest', queueToUse);
      },

      // Starts the timeout on a particular notification
      startTimer: function(queueName, notificationPosition){
        this.store.dispatch('notifaye/start_timer', {queueToUse:queueName, note:notificationPosition});
      },

      // Removes a timeout imediately
      removeNotification: function(queueName, notificationPosition){
        this.store.dispatch('notifaye/delete_specific', {queue:queueName, notificationIndex:notificationPosition});
      },

      complete: function(noteIndex, queueName){
        this.store.dispatch('notifaye/delete_specific', {queue: queueName, notificationIndex:noteIndex});
        if(this.store.getters['notifaye/isVerbose']===true){
          console.log("%cCompleted Note #"+ noteIndex +" in queue \'"+ queueName+"\'", "color: #3e503e; font-style: bold; background-color: #d4dfd4;padding: 0.5rem;");
        }

      },

    }
}
};


export {
  notifayeStore,
  notifaye
}
