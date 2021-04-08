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

Vue.use(notifaye, store)

```

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


### Configuration


### Licence
