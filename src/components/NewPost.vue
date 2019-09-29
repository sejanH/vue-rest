<template>
  <div class="row justify-content-center">
    <div class="col-md-9">
      <h4 v-if="typeof $route.query.todo=='undefined'">Add a new todo</h4>
      <h4 v-if="typeof $route.query.todo!='undefined'">Add a new task</h4>
      <form v-bind:model="newPost" v-on:submit.prevent="addNewPost">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" class="form-control" v-model="newPost.title" />
        </div>
        <div class="form-group">
          <label for="body">Body</label>
          <textarea type="text" class="form-control" v-model="newPost.body" ></textarea>
        </div>
        <input
          type="submit"
          value="Add"
          class="btn bg-vuerest"
          :disabled="newPost.title =='' || newPost.body =='' ? true:false "
        />
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: "new-post",
  data() {
    return {
      newPost: {
        title: "",
        body: "",
        created_at: Date.now(),
        active: true,
        deleted: false,
        token: localStorage.getItem("token")
      }
    };
  },
  watch: {
    "newPost.title"(val) {
      this.newPost.title = val;
    },
    "newPost.body"(val) {
      this.newPost.body = val;
    }
  },
  methods: {
    addNewPost() {
        axios
          .post("http://localhost:8081/api/new/create", this.newPost)
          .then(res => {
            this.$router.go("/my-posts");
          })
          .catch(err => {});
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>
