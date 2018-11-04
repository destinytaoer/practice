let vm = new Vue({
  el: '#app',
  data: {
    todolist: [],
    todo: '',
    hash: 'all'
  },
  created() {
    //=> 获取到存储的数据
    this.todolist = JSON.parse(localStorage.getItem('todoData') || '[]');

    //=> 获取地址的哈希路由，'#/all' 获取第二位后面的字符串
    this.hash = location.hash.slice(2) || 'all';

    //=> 当页面哈希改变的时候触发
    window.onhashchange = () => {
      this.hash = location.hash.slice(2);
    }
  },
  methods: {
    add() {
      let obj = {};
      // 去除首尾空格
      this.todo = this.todo.trim();
      if (!this.todo) return;

      obj.title = this.todo;
      obj.finished = false;
      obj.show = false;
      this.todolist.push(obj);

      // 回车后清除输入框
      this.todo = '';
    },
    remove(cur) {
      this.todolist = this.todolist.filter(item => {
        return cur !== item;
      })
    },
    show(item) {
      item.show = !item.show;
    }
  },
  directives: {
    aa: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    },
    focus(el, obj) {
      if (obj.value) {
        el.focus();
      }
    }
  },
  computed: {
    count() {
      let arr = this.todolist.filter(item => {
        return !item.finished;
      })
      return arr.length;
    },
    todoAry() {
      //=> 由于 todoAry 依赖于 todolist 和 hash
      // 只要 todolist 发生改变，就会触发这个函数，可以在这里把数据更新到 localStorage
      localStorage.setItem('todoData', JSON.stringify(this.todolist));

      // 根据路由去返回不同列表
      switch (this.hash) {
        case 'all':
          //若是全部任务  则需要返回的数组包含所有的任务
          return this.todolist;
          break;
        case 'finished':
          //若是完成的任务  则需要返回的数组包含所有的isSelect是true的项
          return this.todolist.filter((item) => {
            return item.finished;
          });
          break;
        case 'unfinished':
          return this.todolist.filter((item) => {
            return !item.finished
          });
          break;
      }
    },
    tips() {
      switch (this.hash) {
        case 'all':
          return "暂时没有发布任务"
          break;
        case 'finished':
          return "暂时没有完成的任务"
          break;
        case 'unfinished':
          return "暂时没有任务需要完成"
          break;
      }
    }
  }
});