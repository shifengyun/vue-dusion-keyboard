<template>
  <transition
    :enter-active-class="'animated faster '+EnterActiveClass"
    :leave-active-class="'animated faster '+LeaveActiveClass"
    @after-enter="UpdateBound"
  >
    <div
      v-show="show"
      :style="st"
      :class="'my-keyboard my-keyboard__'+size"
      v-drag="{switch:maskShow}"
      @mousedown="mousedown"
      ref="my_keyboard"
    >
      <div class="keypinyinbox" v-if="mode=='CN1'">
        <div v-if="mode=='CN1'" class="pinyin">
          <div>
            <span>{{cn_input}}</span>
          </div>
        </div>
        <div v-if="mode=='CN1'" class="keyselect-list">
          <div>
            <span
              class="select-text"
              v-for="(text, index) in cut_cn_list"
              :key="index"
              @click="e=>clickCN(e, text)"
            >{{(index+1)+'.'+text}}</span>
            <div class="page">
              <p class="previous" @click="previous_page()">v</p>
              <p class="next" @click="next_page()">v</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数字键盘 -->
      <div v-if="mode==='num'||mode==='biaodian'" class="main-keyboard">
        <div class="number-box">
          <span
            class="key number"
            :key="index"
            v-for="(key, index) in number_keys2"
            @click="e=>clickNumber(e, key)"
          >{{key}}</span>
        </div>
        <div class="del-box" style="margin-top:20px;">
          <span class="key number num-del" @click="del()">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="50" height="45">
              <path
                d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
              />
            </svg>
          </span>
          <!-- <span v-if="mode==='biaodian'" class="key number blue"></span>
          <span v-else class="key number" @click="mode='biaodian'">标点</span>-->
          <span
            class="key number"
            @click="mode='en_cap'"
            style="background:#344a5d;color:#fff;font-size:30px;"
          >中/英</span>
          <span class="key key_hide number" style="margin-left: 0px;" @click="HideKey">
            <span>
              隐藏
              <br />
            </span>
          </span>
          <span
            class="key number"
            @click="Fanhui()"
            style="background:#344a5d;color:#fff;font-size:30px;"
          >返回</span>
        </div>
      </div>

      <!-- 普通键盘 -->
      <div v-else class="main-keyboard">
        <span
          class="key"
          v-for="(key, index) in number_keys"
          :key="index+50"
          @click="e=>clickNumber(e, key)"
        >{{key}}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(0,10)"
          :key="index+11"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <br />
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(10,19)"
          :key="index+21"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <br />
        <span
          v-if="mode=='CN1'||mode==='en_cap'"
          class="key cap_change"
          :style="mode=='CN1'?'background: #728fa8;font-size:28px;':'background: #344a5d;'"
          @click="cap_change()"
        >
          <i v-if="mode=='CN1'">CN</i>
          <img
            v-if="mode=='en_cap'"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAhCAQAAABpC6MWAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN
RQfjDAwENC0q3pZrAAABIklEQVQ4y7WUMU7DMABFf0LE0KUsTAxQiYlzUDHAwMDGGViAE1AxdGDj
Cm03xMIJkFhAgoUDsKEGRNMBEII+hiqtE+zEHvhenPg/+X87ipB1nNC2r9jtW/yQ0vIFVhgC8EDD
B0i4JtfAB+hi6qgO2GFSAL7ZrAJWeaWslDUXsMgNNt2b5U3gDJf6NmC3lL6owzLQ4o0qzcrn6e+o
03Bafgqc19pn5YXY87ID9JBYZ+QNwEHEozbkryzWcoAd3YqITuWRZjyTkvHOE8dE+T00WSKzAp/A
aH7TSZ5NEtYYUfExDmjgCSz8+w7BHeJQQJI+5tPEeN1XwwG8GAlRmIJPyYzU07bDdaV9GzBR0wF8
2SNdOHNcGvPCn++U8Z+vdUzH9PwC/0aZnd5/JAQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTIt
MTFUMjA6NTI6NDUrMDg6MDBrBcsKAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEyLTExVDIwOjUy
OjQ1KzA4OjAwGlhztgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVO
RK5CYII="
            alt
          />
        </span>
        <span v-else class="key cap_change" @click="cap_change()">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgCAQAAACiV3CzAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN
RQfjDAwENxkgRzEdAAABiklEQVQ4y83SPWtUURDG8d/NWyFIthDJBwgS01iYWhBEi9Q2EfELCBEs
RCxVUHsrwU4bQcSXFKaJRSwEdSvRTkgKi6i7ixIwiY+FYfcmd2+yYOM5zcyc5z9nzswRu7dJj3T8
8Mx0n9NK4Ii1rtM2tQ9g3EcRTU0RnzT2AAx7LmLJqDHLIhYM1wO3RHx2KMKEFRF3agBzIn461o0c
ty5irg9gZvvwbKpJ1s3sAkxYFXGj0pXbIlZMlABjXot4aqgCDFsQsWysB9wX8cHB6qBCY7vV97YB
8yK+m+wnjzClJeJicNKW2HK6Th5h1pbYcIL3Ii7vJY9wRcQbNsXb/eSh8E5sjvjqsOnirg0bFvNS
ZRVnnDJq1FF84eqOROcrmS/scC9RuOZbN7BYAV51zVXzit63bmiLpQrQFK2eP/K3zrQpYoA1NIjo
PwfK/WjVjrnUpcFuWO+ZI6XwQwdqgLWeOVjz/+XRpZKKB2ZrVC9yrt8bfhuvAX71L+lxbR1PSvaO
n3lTpzKDjutl9w/sFqku62c+8gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMi0xMVQyMDo1NToy
NSswODowME+22fQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTItMTFUMjA6NTU6MjUrMDg6MDA+
62FIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg=="
            alt
          />
        </span>
        <span
          class="key letter"
          v-for="(key, index) in letter_keys.slice(19,26)"
          :key="index+31"
          @click="e=>clickKey(e, key)"
        >{{key}}</span>
        <span class="key key_hide" @click="HideKey">
          <span>
            隐藏
            <br />
          </span>
        </span>
        <br />
        <span
          v-if="mode=='CN1'"
          @click="cn_change()"
          class="key blue"
          style="font-size:28px;width:79px;font-weight:bold;"
        >
          <span style="font-size:28px;font-weight:bold;">中</span>
          <i style="font-size:35px;font-weight:500;">/</i>
          <i style="font-size:16px;font-weight:500;">英</i>
        </span>
        <span
          v-else
          @click="cn_change()"
          class="key blue"
          style="font-size:28px;width:79px;font-weight:bold;"
        >
          <span style="font-size:28px;font-weight:bold;">英</span>
          <i style="font-size:35px;font-weight:500;">/</i>
          <i style="font-size:16px;font-weight:500;">中</i>
        </span>
        <!--<span @click="mode='hand'" class="key red">手写</span>-->
        <span @click="num_change()" class="key blue" style="font-size:22px;margin-left:7px;">数字</span>
        <span @click="bd_change()" class="key blue" style="font-size:22px;margin-left:7px;">标点</span>
        <!-- <span class="key" @click="e=>clickKey(e, '@',true)">@</span> -->
        <span
          class="key"
          @click="e=>clickKey(e, '.',true)"
          style="font-size:22px;margin-left:7px;"
        >.</span>
        <span
          class="key space"
          @click="e=>clickKey(e, ' ',true)"
          style="font-size:22px;margin-left:7px;"
        >空格</span>
        <span class="key def-del" style="width:114px;margin-left:7px;" @click="del()">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
            <path
              d="M938.8 227.7H284.6L0.1 511.3l284.4 284.4v0.8h654.2c47.1 0 85.3-38.2 85.3-85.3V313c0.1-47.1-38.1-85.3-85.2-85.3z m-172.1 385l-40.2 40.2-100.6-100.6-100.6 100.6-40.2-40.2 100.6-100.6-100.6-100.5 40.2-40.2L625.9 472l100.6-100.6 40.2 40.2-100.6 100.5 100.6 100.6z"
              fill="#344A5D"
            />
          </svg>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import AllKey from "./key";
import dict from "./dist/pinyin_dict_notone";
import paint from "./paint.vue";
export default {
  name: "vue-dusion-keyboard",
  mounted() {
    //注册全局方法
    if (this.window) {
      window.$show_keyboard = this.show_keyboard;
      window.$hide_keyboard = this.hide_keyboard;
    }
    window.sign_up_keyboard = this.sign_up_keyboard;
    this.sign_up_keyboard();
  },
  components: { paint },
  props: {
    size: { type: String, default: "primary" },
    window: { type: Boolean, default: false },
    hand: { type: Boolean, default: false },
    float: { type: Boolean, default: false },
    all: { type: Boolean, default: false },
    blurHide: { type: Boolean, default: true },
    EnterActiveClass: { type: String, default: "fadeInUp" },
    LeaveActiveClass: { type: String, default: "fadeOutDown" },
    HandWriteApi: [String]
  },
  data() {
    return {
      st: "",
      show: false,
      input_top: 0,
      input: "",
      def_mode: "CN1",
      old_mode: "en_cap",
      main_width: 0,
      main_height: 0,
      number_keys: AllKey.number,
      cn_input: "",
      cn_list_str: "",
      l_min: 0,
      l_max: 6,
      handLib: "CN",
      touchStatus: false,
      startY: 0,
      timer: null,
      maskShow: true
    };
  },
  computed: {
    letters() {
      const letters = [];
      for (let i in this.cities) {
        letters.push(i);
      }
      return letters;
    },
    number_keys2() {
      return this.mode === "num" ? AllKey.number2 : AllKey.biaodian;
    },
    letter_keys() {
      return this.mode === "en_cap" ? AllKey.cap_letter : AllKey.letter;
    },
    cn_list() {
      return this.cn_list_str ? this.cn_list_str.split("") : [];
    },
    cut_cn_list() {
      return this.cn_list.slice(this.l_min, this.l_max);
    },
    mode: {
      get() {
        return this.def_mode;
      },
      set(val) {
        this.old_mode = this.mode;
        if (val == "hand" && !this.hand) return;
        this.def_mode = val;
        if (val == "hand") {
          this.$nextTick(() => {
            this.main_width = this.$refs["my_keyboard"].offsetWidth;
            this.main_height = this.$refs["my_keyboard"].offsetHeight;
          });
        }
      }
    }
  },
  directives: {
    drag(el, value) {
      const on = value.value.switch; // 开关
      let firstUse = true; // 初始化
      let startX = el.offsetLeft;
      let startY = el.offsetTop;
      let disX = 0;
      let disY = 0;

      el.ontouchstart = function(e) {
        if (on && firstUse) {
          firstUse = false;
          // 记录dom初始位置
          startX = el.offsetLeft;
          startY = el.offsetTop;
          // 鼠标按下，计算当前元素距离可视区的距离
          disX = e.touches[0].clientX - el.offsetLeft;
          disY = e.touches[0].clientY - el.offsetTop;
        } else if (on) {
          disX = e.touches[0].clientX - el.offsetLeft;
          disY = e.touches[0].clientY - el.offsetTop;
        }
      };
      el.ontouchmove = function(e) {
        if (on) {
          // 通过事件委托，计算移动的距离
          let left = e.touches[0].clientX - disX;
          let top = e.touches[0].clientY - disY;

          // 移动当前元素
          el.style.transition = "all 0 ease-out";
          el.style.left = left + "px";
          el.style.top = top + "px";
        }
      };
      el.ontouchend = function(e) {
        // e.preventDefault();
        // 恢复初始位置
      };
    }
  },

  methods: {
    /**重新注册所有input标签 */
    sign_up_keyboard() {
      const _this = this;
      this.$nextTick(() => {
        //每个input添加事件
        let inputAll = document.getElementsByTagName("input");
        for (var i = 0; i < inputAll.length; i++) {
          if (_this.all || inputAll[i].dataset.mode) {
            inputAll[i].addEventListener("focus", _this.show_keyboard);
            if (_this.blurHide) {
              inputAll[i].addEventListener("blur", _this.hide_keyboard);
            }
          }
        }
        let testareaAll = document.getElementsByTagName("textarea");
        for (var i = 0; i < testareaAll.length; i++) {
          if (_this.all || testareaAll[i].dataset.mode) {
            testareaAll[i].addEventListener("focus", _this.show_keyboard);
            if (_this.blurHide) {
              testareaAll[i].addEventListener("blur", _this.hide_keyboard);
            }
          }
        }
      });
    },
    /**注册显示键盘事件 */
    show_keyboard(e) {
      this.input = e.target;
      this.show = true;
      this.mode = e.target.dataset.mode;
      if (this.input && this.float) {
        let bound = this.input.getBoundingClientRect();
        let toptop = document.documentElement.scrollTop;
        let wiDth = window.document.body.offsetWidth / 2 - 380; //当前页面宽度
        this.st = {
          position: "fixed",
          left: wiDth + "px",
          "z-index": "100000000000",
          bottom: 0
        };
        if (this.mode == "CN1") {
          this.st.height = "511px";
        } else {
          this.st.height = "370px";
        }
      }
    },
    /**注册隐藏键盘事件 */
    hide_keyboard(e) {
      if (
        (this.all && e.relatedTarget && e.relatedTarget.tagName == "INPUT") ||
        (e.relatedTarget && e.relatedTarget.dataset.mode)
      )
        return;
      this.show = false;
    },
    /**重新初始化一下canvas的位置信息 */
    UpdateBound() {
      this.$refs.paint && this.$refs.paint.UpdateBound();
    },
    HideKey(e) {
      this.show = false;
      this.input.blur();
    },
    mousedown(e) {
      e.preventDefault();
    },
    /**手写选择文字*/
    HandText(text) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      this.input.value = this.insertString(this.input.value, text, index);
      this.TheEnd(index + 1);
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    //点击按钮
    clickKey(e, key, pass) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      e.preventDefault();

      if (this.mode == "CN1" && !pass) {
        this.cn_input += key;
        this.l_min = 0;
        this.l_max = 6;
        let re = new RegExp(`^${this.cn_input}\\w*`);
        let keys = Object.keys(dict)
          .filter(key => re.test(key))
          .sort();
        // console.log(keys);
        this.cn_list_str =
          keys.length > 1
            ? keys.reduce((a, b) => a + dict[b], "")
            : dict[keys[0]]; //dict[this.cn_input];
      } else {
        // this.input.value += key;
        this.input.value = this.insertString(this.input.value, key, index);
        this.TheEnd(index + 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    clickNumber(e, key) {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      e.preventDefault();
      if (this.mode == "CN1" && this.cn_input !== "") {
        this.input.value += this.cut_cn_list[parseInt(key) - 1];
        this.cn_input = "";
        this.cn_list_str = "";
      } else {
        // this.input.value += key;
        this.input.value = this.insertString(this.input.value, key, index);
        this.TheEnd(index + 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    clickCN(e, text) {
      let index = this.input.selectionStart;

      e.preventDefault();
      // this.input.value += text;
      this.input.value = this.insertString(this.input.value, text, index);
      this.cn_input = "";
      this.cn_list_str = "";
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
      this.TheEnd(index + 1);
    },
    del() {
      if (this.input !== document.activeElement) return;
      let index = this.input.selectionStart;
      if (this.mode == "CN1" && this.cn_input !== "") {
        this.cn_input = this.delStringLast(
          this.cn_input,
          this.cn_input.length - 1
        );
        this.l_min = 0;
        this.l_max = 6;
        this.cn_list_str = dict[this.cn_input];
      } else {
        this.input.value = this.delStringLast(this.input.value, index - 1);
        this.TheEnd(index - 1);
      }
      //触发input事件
      this.input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    /**字符串插入文字 */
    insertString(text, input, index) {
      let arrText = text.split("");
      arrText.splice(index, 0, input);
      return arrText.join("");
    },
    /**删除字符串的某个字符*/
    delStringLast(text, index) {
      let arrText = text.split("");
      arrText[index] = "";
      // arrText.pop();
      return arrText.join("");
    },
    /**光标归位*/
    TheEnd(index) {
      this.input.selectionStart = index;
      this.input.selectionEnd = index;
    },
    cap_change() {
      if (this.mode !== "CN1") {
        this.mode = this.mode === "en_cap" ? "en_let" : "en_cap";
      }
      if (this.mode == "CN1") {
        this.st.height = "511px";
      } else {
        this.st.height = "370px";
      }
    },
    cn_change() {
      this.mode = this.mode == "CN1" ? "en_cap" : "CN1";
      this.cn_input = "";
      this.cn_list_str = "";
      if (this.mode == "CN1") {
        this.st.height = "511px";
      } else {
        this.st.height = "370px";
      }
    },
    num_change() {
      this.mode = "num";

      if (this.mode == "CN1") {
        this.st.height = "511px";
      } else {
        this.st.height = "370px";
      }
    },
    bd_change() {
      this.mode = "biaodian";
      if (this.mode == "CN1") {
        this.st.height = "511px";
      } else {
        this.st.height = "370px";
      }
    },
    Fanhui() {
      this.mode = this.old_mode;
      if (this.mode == "CN1") {
        this.st.height = "511px";
      } else {
        this.st.height = "370px";
      }
    },
    previous_page() {
      if (this.l_min > 0) {
        this.l_min = this.l_min - 6;
        this.l_max = this.l_max - 6;
      }
    },
    next_page() {
      if (this.cn_list.length > this.l_max) {
        this.l_min += 6;
        this.l_max += 6;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "./style/animate.part.css";
@import "./style/primary.scss";
@import "./style/mini.scss";
i {
  font-style: normal;
}
.num-del > svg {
  margin-top: 10px;
}
.def-del > svg {
  margin-top: 0px;
}
.hand-del > svg {
  margin-top: 0px;
}
.my-keyboard {
  width: 760px;

  // min-width: $min-width;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .keypinyinbox {
    padding: 10px 20px;
    background: #b4b5bc;
    margin: auto;
    margin-bottom: 10px;
    border-radius: 10px;
    .pinyin,
    .keyselect-list {
      border-radius: 8px;
      > div {
        // width: $min-width;
        margin: auto;
      }
    }
    .pinyin {
      height: 44px;
      background: #fff;
      margin-bottom: 8px;
      border: 1px solid rgba(209, 209, 209, 1);
      padding: 0 20px;
      text-align: left;
      > div span {
        font-size: 26px;
        line-height: 40px;
        font-weight: bold;
      }
    }
    .keyselect-list {
      height: 56px;
      background: #fff;
      border: 1px solid rgba(209, 209, 209, 1);
      border-top: none;
      padding: 0 20px;

      text-align: left;
      > div {
        position: relative;
      }
      .select-text {
        cursor: pointer;
        line-height: 57px;
        font-size: 22px;
        font-weight: bold;
        & + .select-text {
          margin-left: 48px;
        }
      }
      .page {
        position: absolute;
        top: 7px;
        right: 50px;
        width: 138px;
        height: 40px;
        .previous {
          transform: scaleX(2) rotate(180deg);
        }
        > p {
          margin-top: 0px;
          margin-bottom: 0px;
          display: inline-block;
          text-align: center;
          transform: scaleX(2);
          width: 32px;
          height: 40px;
          background: rgba(52, 74, 93, 1);
          border-radius: 4px;
          line-height: 40px;
          color: #fff;
          border: 1px solid hsl(0, 0%, 84%);

          cursor: pointer;
          &:active {
            background: #fff;
            color: #344a5d;
          }
          & + p {
            margin-left: 30px;
          }
        }
      }
    }
  }

  .main-keyboard {
    padding: 0 10px;
    background: #b4b5bc;
    height: 370px;
    border-radius: 10px;
    .key {
      height: 60px;
      line-height: 60px;
      font-size: 36px;
      font-weight: bold;
      // width: $key-width;
      background: #fff;
      display: inline-block;
      vertical-align: middle;
      border-radius: 8px;
      margin-top: 10px;
      box-shadow: 0px 3px 3px rgba(20, 20, 20, 0.3);
      cursor: pointer;
      &:active {
        background: #d0d0d0;
      }
      // & + .key {
      //   margin-left: 28px;
      // }
    }
    .number-box {
      // width: $number-width * 3 + $key-left * 2;
      display: inline-block;
      vertical-align: middle;
      margin-top: 20px;
    }
    .del-box {
      // width: $number-width + $key-left * 2;
      display: inline-block;
      vertical-align: middle;
      .key {
        margin-left: 0px;
      }
      // .key_hide{
      //   width: $number-width;
      // }
    }
    .hand-left-box {
      width: 100px;
      display: inline-block;
      vertical-align: middle;
      .key {
        width: 85px;
        margin-left: 0px;
        margin-top: 20px;
        &:nth-of-type(1) {
          margin-top: 0px;
        }
      }
    }
    .number {
      // width: $number-width;
      height: 67px;
      font-size: 42px;
      line-height: 67px;
      &:nth-last-of-type(3n) {
        margin-left: 0px;
      }
    }
    .cap_change {
      width: 79px;
      color: #fff;
      background: #fff;
      &:active {
        background: #728fa8;
      }
      img {
        margin: 14px auto;
      }
    }
    .key_hide {
      background: #d6d1d0;
      width: 114px;
      > .jp {
        height: 60px;
        display: inline-block;
        vertical-align: middle;
      }
      > span {
        padding-left: 10px;
        font-size: 22px;
        // line-height: 18px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .blue {
      width: 63px;
      color: #fff;
      background: #344a5d;
      &:active {
        background: #728fa8;
      }
    }
    .red {
      color: #fff;
      background: #f56c6c;
      &:active {
        background: #f89e9e;
      }
    }
    // .space {
    //   width: 338px;
    // }
  }
}
</style>
