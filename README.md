# Notifaye
## A notification system for the Vue Ecosystem (Vue + Vuex)
Notifaye provides a easy to use plugin for Vue that leverages the extensibility of the Vuex store and provides the ability to create and manage dynamic and static notification queues.

The idea of this plugin is to be style / component agnostic.
There is the option to use the built in styling or components but the core function of the plugin is to provide the underlying methods / structures and leave the styling / animation etc to the developer.

### Features
- Notifications with timers that can be configured per queue or per notification
- Styleable via css or classes
- Multiple notification Queues
- Dynamic or Static notifications (For toast style and bell/counter style notifications)
- Advanced queue options like "Dessimate", "Remove Early", "Remove Oldest", "Remove Youngest", "Extend"
- Queues accessible via Vuex store (this.$store) and your own methods or via the Notifaye plugin with it's provided methods(this.$notifaye).


## Requirements

Required Packages
- Vue 2+
- Vuex

## Install

#### Step 1)
```

npm install notifaye

```

#### Step 2
Then import and utilise the plugin
##### Important Note
It is important to pass in the instance of your Vuex store next to notifaye in Vue.use() as Notifaye leverages it in the plugin.

```

import { notifaye } from 'Notifaye'

Vue.use(notifaye, store, options)

```
The third parameter here is the options object for configuration of the Notifaye instance.

#### Step 3
Finally add the plugin as a Vuex module. This allows Vuex to include our store as a namespaced substore (module) and gives it the ability to be accessed via Vuex normal store methods.

So, firstly import.
```

import { notifayeStore } from 'Notifaye'

```
And then register it as a module on the store object

```

modules: {
  notifaye: notifayeStore
},

```



### Usage
By default, Notifaye instantiates with a "default" notification queue. More can be added via the newQueue() method.
All functions assume the default queue if no queue is explicitly passed into the methods as a parameter.

| Method | Description | Parameters | Output |
| ------ | ----------- | ---------- | ------ |
| Vue.$notifaye.add() | Adds a new notification to a queue. | - | - |
| Vue.$notifaye.newQueue() | Adds a new queue to carry notifications. | - | - |
| Vue.$notifaye.count() | Returns the number of notifications in a queue. | - | - |
| Vue.$notifaye.listQueues() | Returns all queues. | - | - |
| Vue.$notifaye.notes() | Returns all the notifications in a queue.  | - | - |
| Vue.$notifaye.dessimate() | Removes all notifications from a queue.  | - | - |
| Vue.$notifaye.removeNewest() | Removes the youngest / newest notification from the queue array. i.e. Index 0.  | - | - |
| Vue.$notifaye.removeOldest() | Removes the oldest notification from a queue (array). i.e. Index -1  | - | - |
| Vue.$notifaye.startTimer() | Starts the timeout until a notification disappears.  | - | - |
| Vue.$notifaye.removeNotification() | Removes a specific notification at a given index in a queue.  | - | - |

### Configuration
Congiguration options are yet to be implemented.
They are currently being worked on.

### Licence
MIT
