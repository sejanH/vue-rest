<template>
  <div>
    <div id="Post" class="row justify-content-center">
      <div class="col-md-3" id="Post-list">
        <div style="display:block;">
          <h6 style="display: inline-block;">Select one</h6>
          <button
          v-if="$route.name=='posts'"
          @click="$router.push({name:'new-post'})"
          class="btn bg-vuerest btn-xs"
          title="Add new"
          >&#x2725;</button>
          <button
          v-if="$route.name == 'new-post'"
          @click="$router.go(-1)"
          class="btn bg-vuerest btn-xs"
          title="Back"
          >&#x276E;&#x276E;</button>
        </div>
        <div class="scrollbar">
          <div class="handle">
            <div class="mousearea"></div>
          </div>
        </div>

        <div class="frame smart" id="smart" v-if="parentPost != -1">
          <ul class="items">
            <li
            v-for="(post) in parentPost"
            v-bind:key="post._id"
            @click="showPost(post._id)"
            :class="[$route.name=='my-posts'?'':'disabled']"
            >
            <span class="PostActions" v-if="selectedPost[0]._id==post._id">
              <button class="btn btn-xs bg-danger" @click="deletePost(post._id)">X</button>
            </span>
            <small>{{post.title }}</small>
          </li>
        </ul>
      </div>
    </div>
    <br />
    <div class="col-md-8 col-xs-11 col-sm-11" v-if="$route.name=='Post'">
      <table class="table table-borderless table-sm" v-if="selectedPost.length !== 0">
        <tr id="Post">
          <td
          :class="[selectedPost[0].deleted ? 'strike':'','']"
          style="font-size: 1.15rem;font-weight: 600"
          >
          {{selectedPost[0].title}}-
          <small>{{selectedPost[0].body}}</small>
        </td>
        <td
        style="float:right;font-size:0.75rem;display : flex;align-items : center;"
        >{{selectedPost[0].created_att}}</td>
        <td>
          <button class="btn btn-xs bg-vuerest" title="Add new task" @click="addTask">&#x2724;</button>
        </td>
      </tr>
    </table>
    <div v-if="parentPost.length > 0 && parentPost != -1">
      <button
      v-if="selectedPost[1].length > 0"
      class="btn bg-vuerest btn-block"
      @click="SaveChanges(selectedPost[0]._id)"
      :disabled="!SaveChangesEnabled"
      >Save changes</button>
    </div>
    <div class="text-center centered" v-if="parentPost != -1 && parentPost.length == 0">
      <div class="spinner-grow text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="alert alert-warning" role="alert" v-if="parentPost == -1">
      Hi No Posts Found by your name
      <router-link :to="{name:'new-post'}">create one now</router-link>
    </div>
  </div>
  <div class="col-md-8 col-xs-11 col-sm-11" v-else>
    <router-view></router-view>
  </div>
</div>
</div>
</template>
<script>
  import swal from "sweetalert";
  export default {
    name: "posts",
    data() {
      return {
        Posts: [],
        list: [],
        parentPost: [],
        selectedPost: [],
        editable: true,
      };
    },
    watch: {
      selectedPost(val) {
        this.selectedPost = val;
      },
      SaveChangesEnabled(val) {
        this.SaveChangesEnabled = val;
      }
    },
    created() {
      this.getPost();
    },
    methods: {
      dateBeautify(data) {
        data.forEach((currentValue) => {
          let m = new Date(parseInt(currentValue.created_at));
          currentValue.created_att = m.getFullYear() +"-" + m.getMonth() + "-" + m.getDate() +" " + m.getHours() + ":" +m.getMinutes() + ":" + m.getSeconds();
          currentValue.tasks.forEach(val => {
            let d = new Date(parseInt(val.created_at));
            val.created_att =
            d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " +d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
          });
        });
      },
      async getPost() {
        await axios.get("http://localhost:8081/api/my-posts", {
          params: {
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          if (res.data.length == 0) {
            this.parentPost = -1;
          } else {
            const plugin = document.createElement("script");
            plugin.setAttribute("src", "/js/sly.min.js");
            plugin.async = true;
            document.head.appendChild(plugin);
            this.Posts = res.data; 
            this.parentPost = res.data;
            this.dateBeautify(this.Posts);
            if (id == null) {
             this.showPost(this.Posts[0]._id);
            } else {
             this.showPost(id);
            }

          }
        })
        .catch(err => {
          if (err.request.response == "expired") {
            this.$root.$emit("expired");
          } else if (err.request.status == 0) {
            this.getPost();
            swal({
              icon: "error",
              title: "Sorry !",
              text:
              "Connection to server failed! Reload the page or try again later"
            });
          }
        });
      },
      showPost(PostId) {
        console.log("Post:"+PostId)
        this.selectedPost = [];
        let Post = [];
        Post[0] = this.Posts.filter(data => data._id == PostId)[0];
        this.selectedPost = Post;
      },
      deletePost(PostId) {
        swal("Delete the Post?", {
          buttons: {
            cancel: "No!",
            Logout: {
              text: "Yes! Delete",
              value: "delete"
            }
          }
        }).then(value => {
          switch (value) {
            case "delete":
            axios
            .post("http://localhost:8081/api/post/delete", {
              token: localStorage.getItem("token"),
              PostId
            })
            .then(res => {
              this.getPost();
            })
            .catch(err => {});
            break;
            default:
            swal({ text: "Delete cancelled!", button: false, timer: 1000 });
          }
        });
      },
      dataParse(data) {
        data.forEach((currentValue) => {
          delete currentValue.created_att;
          currentValue.tasks.forEach((val) => {
           delete val.created_att;
        });
        });
      },
    },
    mounted() {
    },
    computed: {
    }
  };
</script>

<style scoped>
#Post {
  min-height: calc(100vh - 41px);
  max-height: 100vh;
}
h5,
tr#Post {
  text-align: center;
  color: grey;
  border-bottom: 1px solid grey;
}
.wrap {
  position: relative;
  float: left;
  width: 550px;
  margin: 0 40px 3em 0;
}
.wrap:nth-child(2n) {
  margin-right: 0;
}

/* Frame */
.frame {
  height: 80vh;
  overflow: hidden;
}
.frame .slidee {
  padding: 20px 25px;
  background: #fff;
}
.frame ul.items {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 98%;
  font-size: 20px;
  line-height: 80px;
}
.frame ul.items li {
  float: left;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid grey;
  padding: 0;
  text-align: center;
  cursor: pointer;
}
.frame ul.items li.active {
  color: #000;
  background: rgba(93, 219, 226, 0.8);
}
.frame ul.items li:hover,
.frame ul.items li:focus {
  color: #000;
  background: rgba(18, 158, 158, 0.25);
}
/* Scrollbar */
.scrollbar {
  position: absolute;
  right: 10px;
  width: 5px;
  height: 80vh;
  background: #ccc;
  line-height: 0;
}
.scrollbar .handle {
  width: 100%;
  height: 100px;
  background: rgba(18, 158, 158, 1);
  cursor: pointer;
}
.scrollbar .handle .mousearea {
  position: absolute;
  top: 0;
  left: -10px;
  width: 22px;
  height: 100%;
}
.strike {
  text-decoration: line-through;
}
span.actions {
  float: right;
}
/* draggable css*/
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
div.centered {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
button.btn-xs {
  padding: 0 0.25rem;
  font-size: 1rem;
  font-weight: 400;
  float: right;
}
.PostActions {
  float: right;
}
.items > li .PostActions {
  opacity: 0;
}
.items > li:hover .PostActions {
  opacity: 1;
  cursor: pointer;
}
.frame ul.items li.disabled {
  /*pointer-events: none;*/
  cursor: not-allowed;
}
</style>