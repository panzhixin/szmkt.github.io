<template>
  <div class="addGoods">
    <div class="stepControl">
      <el-steps :active="activeStep" align-center finish-status="success">
        <el-step title="编辑基本信息"></el-step>
        <el-step title="组合搭配与活动设置"></el-step>
        <el-step title="完成设置"></el-step>
      </el-steps>
    </div>
    <div class="stepBox" v-if="activeStep == 0">
      <el-form label-width="15px" :model="goodsForm" :rules="goodsFormRules">
        <div class="step">
          <div class="content-panel">
            <p class="title"><span class="redStar">*</span>商品基本信息</p>
            <p class="title-item">
              <span class="redStar">*</span>商品标题
              <span class="title-tip">商品标题应为25个字符以下</span>
            </p>
            <el-form-item prop="title">
              <el-tooltip class="item" effect="dark" content="商品标题应为25个字符以下" placement="right">
                <el-input
                  style="width:500px;"
                  placeholder="请输入商品标题"
                  v-model="goodsForm.title"
                  maxlength="25"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <p class="title-item">
              <span class="redStar">*</span>商品简称
              <span class="title-tip">商品简称应为6个字符以下</span>
            </p>
            <el-form-item prop="shortTitle">
              <el-tooltip class="item" effect="dark" content="商品简称应为6个字符以下" placement="right">
                <el-input
                  style="width:500px;"
                  placeholder="请输入商品简称"
                  v-model="goodsForm.shortTitle"
                  maxlength="6"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <p class="title-item">
              <span class="redStar">*</span>商品类目
              <span class="title-tip">买家根据类目可更快地找到您的商品</span>
            </p>
            <el-form-item prop="selectedOptions">
              <el-tooltip class="item" effect="dark" content="提示：买家根据类目可更快地找到您的商品" placement="right">
                <el-cascader
                  :props="goodsProp"
                  :options="options"
                  v-model="goodsForm.selectedOptions"
                  @change="getType"
                  style="width:500px;margin-bottom:0;"
                ></el-cascader>
              </el-tooltip>
            </el-form-item>

            <p class="title-item">
              <span style="display:inline-block;height:30px;width:15px;"></span>商品编码
              <span class="title-tip">可自定义的商品编码,非必填,应控制在20个字符内</span>
            </p>
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="可自定义的商品编码,非必填,应控制在20个字符内"
                placement="right"
              >
                <el-input
                  placeholder="请输入SKU编码"
                  style="width:500px;"
                  v-model="goodsForm.coding"
                  maxlength="20"
                ></el-input>
              </el-tooltip>
            </el-form-item>

          </div>

          <div class="content-panel">
            <p class="title">
              <span class="redStar">*</span>添加商品主图
              <span class="title-tip">最多可上传4张，尺寸：800X800</span>
            </p>
            <div class="mainPic">
              <upload-photo
                :photoFile="goodsForm.goodsPhoto.file"
                :legend="goodsForm.goodsPhoto.text"
                :photoLength="goodsForm.goodsPhoto.length"
                :uploadType="1"
                :uploadSize="[800,800]"
                @removeFile="removeGoodsPhoto"
                @uploadFile="addGoodsPhoto"
              ></upload-photo>
            </div>
            <p class="title">
              <span class="redStar">*</span>转发封面<span class="title-tip">最多可上传1张，尺寸：400X320</span></p>
            <div class="coverPic">
              <upload-photo
                :photoFile="goodsForm.coverPhoto.file"
                :action="goodsForm.coverPhoto.action"
                :legend="goodsForm.coverPhoto.text"
                :photoLength="goodsForm.coverPhoto.length"
                :uploadType="1"
                :uploadSize="[400,320]"
                @removeFile="removeCoverPhoto"
                @uploadFile="addCoverPhoto"
              ></upload-photo>
            </div>

            <p class="title-item">
              <span style="display:inline-block;height:30px;width:15px;"></span>转发语
              <span class="title-tip">用于显示在买家推荐给好友的页面</span>
            </p>
            <el-form-item prop="forwardSentence">
              <el-tooltip class="item" effect="dark" content="提示：用于显示在买家推荐给好友的页面" placement="right">
                <el-input
                  placeholder="我发现了超值宝贝，快来看看吧！"
                  style="width:500px;"
                  maxlength="25"
                  v-model="goodsForm.forwardSentence"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <div class="introduce">
              <p class="title" style="border:none;margin-bottom:0;"><span class="redStar">*</span>商品详情</p>
              <div class="introduceContent">
                <editor v-model="goodsForm.detail" @addEditorPhoto="addEditorPhoto"></editor>
              </div>
            </div>
          </div>
        </div>
        <div class="step">
          <div class="content-panel">
            <p class="title" style="border:none;margin-bottom:0;"><span class="redStar">*</span>商品规格与库存</p>
            <el-table
              border
              :data="goodsForm.formatData"
              style="width: calc(100% - 40px);margin-left:15px;"
            >
              <el-table-column prop="className" label="规格" width="300" align="center"></el-table-column>
              <el-table-column prop="stock" label="库存" align="center"></el-table-column>
              <el-table-column label="销售价(元)" align="center">
                <template slot-scope="scope">{{(scope.row.salPrice/100).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column label="市场价(元)" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.mktPrice + '' != '' && scope.row.mktPrice != null && scope.row.mktPrice != '0'"
                  >{{(scope.row.mktPrice/100).toFixed(2)}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <!-- <span v-if="scope.$index === 0">
                    <el-button type="text" @click="editFormat(scope.row,scope.$index)">编辑</el-button>
                  </span>
                  <span v-else>
                    <el-button type="text" @click="editFormat(scope.row,scope.$index)">编辑</el-button>
                    <el-button
                      type="text"
                      @click.native.prevent="deleteRow(scope.$index, goodsForm.formatData)"
                    >删除</el-button>
                  </span> -->
                  <span class="operateBox" v-if="scope.$index === 0">
                      <span 
                      class="operateBtn primaryBtn"
                      @click="editFormat(scope.row,scope.$index)">编辑</span>
                  </span>
                  <span class="operateBox" v-else>
                      <span 
                      class="operateBtn primaryBtn" 
                      @click="editFormat(scope.row,scope.$index)">编辑</span>
                      <span 
                      class="operateBtn errorBtn" 
                      @click="deleteRow(scope.$index, goodsForm.formatData)">删除</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
              <el-button
              icon="el-icon-plus"
              @click="addFormat"
              style="width:calc(100% - 40px);
              margin:20px 0 0 -10px;
              border:1px dashed #ABB2C0;"
              >新增规格</el-button>
          </div>

          <el-dialog
            :title="formatTitle"
            :visible.sync="formatDialog"
            :close-on-click-modal="false"
            width="700px"
          >
            <el-form
              class="formatForm"
              :model="formatForm"
              label-width="150px"
              style="width:90%;margin:20px auto 0;"
              :rules="goodsFormRules"
            >
              <el-form-item label="规格" prop="format">
                <el-tooltip class="item" effect="dark" content="规格名称请控制在12个字符以下" placement="top">
                  <el-input v-model="formatForm.format" placeholder="请输入规格" maxlength="12"></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="库存" prop="stock">
                <el-input
                  v-model="formatForm.stock"
                  placeholder="请输入库存"
                  maxlength="9"
                  @keyup.native="number('stock')"
                ></el-input>
              </el-form-item>
              <el-form-item label="销售价(元)" prop="sellPrice">
                <el-input
                  v-model="formatForm.sellPrice"
                  placeholder="请输入销售价"
                  maxlength="10"
                  @keyup.native="number('sellPrice')"
                ></el-input>
              </el-form-item>
              <el-form-item label="市场价(元)" prop="marketPrice">
                <el-input
                  v-model="formatForm.marketPrice"
                  placeholder="请输入市场价"
                  maxlength="10"
                  @keyup.native="number('marketPrice')"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button
                @click="formatDialog = false"
                style="margin:0 50px 0 20px;padding:15px 60px;"
              >取 消</el-button>
              <el-button
                type="primary"
                @click="submitFormat"
                style="margin:0 130px 0 20px;padding:15px 60px;"
              >确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <el-button
          type="primary"
          style="width:240px;height:50px;margin:0 auto 15px;background:#4181FE;"
          @click="finishFirst"
          :disabled="firstDis"
        >下一步</el-button>
      </el-form>
    </div>
    <div class="stepBox" v-else-if="activeStep == 1">
      <el-form :model="goodsForm" :rules="goodsFormRules">
        <div class="step">
          <div class="content-panel">
            <p class="title">组合搭配</p>
            <p class="title-item">搭配选择</p>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="点击选择引流品" placement="right">
                <el-button @click.native="openDrainage" style="float:left;">{{goodsForm.drainage}}</el-button>
              </el-tooltip>
            </el-form-item>
            <p class="title-item">为你的商品和组合商品的搭配写一句转发语（非必填）</p>
            <div class="drainageWord">
              <div class="drainageWord-content">
                <el-input
                  v-model="goodsForm.drainageWord"
                  style="width:400px;"
                  class="drainageWord-content-input"
                  maxlength="25"
                  placeholder="例：下雨天和草莓更配哦，搭配购买只需￥19.99"
                ></el-input>
              </div>
            </div>
            
            <drainage-list
            :drainageInfo="drainageInfo"
            :drainageDialog="drainageDialog"
            :drainageData="drainageData"
            @closeDrainageDialog="closeDrainageDialog"
            @changeDrainage="changeDrainage"
            @submitDrainage="submitDrainage"
          ></drainage-list>
          </div>
        </div>
        <div class="step">
          <div class="content-panel">
              <p class="title">活动设置</p>
              <p class="title-item" style="font-weight:bold;">1、满减活动</p>
              <el-form-item style="margin-bottom:10px;">
                <el-radio-group v-model="activy" @change="changeSelect">
                  <div style="overflow:hidden;">
                    <el-radio :label="0" border>不参与</el-radio><br/>
                  </div>
                  <el-radio
                    v-for="(item,index) in activyList"
                    :key="index"
                    :label="item.label"
                    border
                  >{{item.title}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <p class="title-item" style="font-weight:bold;">2、赏金任务</p>
              <el-form-item style="margin-bottom:0;margin-top:10px;">
                <el-radio-group
                  v-model="taskRadio"
                  @change="changeSelectTask"
                  style="line-height:40px;"
                >
                  <el-radio :label="0">不参与</el-radio>
                  <br>
                  <el-radio :label="1">参与，请填写以下信息</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="task" style="margin-bottom:10px;" v-if="isShowTask">
                <el-form-item label="任务时长" prop="activyTime">
                  <el-tooltip class="item" effect="dark" content="任务时长可为1-99小时" placement="right">
                    <el-input
                      v-model="goodsForm.activyTime"
                      style="width:200px;"
                      maxlength="2"
                      @keyup.native="number('activyTime')"
                    >
                      <template slot="append">小时</template>
                    </el-input>
                  </el-tooltip>
                </el-form-item>
                <el-table 
                  border
                  :data="goodsForm.activyContent"
                  :span-method="arraySpanMethod"
                  style="width: 550px;" 
                  class="targetForm">
                  <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.$index+1}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="推荐人数（人）" width="180" align="center">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.target"
                        :disabled="targetDisable"
                        maxlength="2"
                        @keyup.native="number('target',scope.$index)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="赏金比例%" align="center">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="赏金比例应为1到99" placement="right">
                        <el-input
                          v-model="scope.row.percent"
                          :disabled="targetDisable"
                          maxlength="2"
                          @keyup.native="number('percent',scope.$index)"
                        >
                          <template slot="append">%</template>
                        </el-input>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="120">
                  </el-table-column>
                </el-table>
                <el-button
                  type="text"
                  style="position:absolute;top:200px;left:470px;"
                  @click="editTarget"
                >{{targetBtnTxt}}</el-button>
              </div>
            </div>
            <el-button
              type="primary"
              style="width:240px;height:50px;margin:15px auto;background:#4181FE;"
              @click="submit"
              :disabled="submitDis"
            >提交</el-button>
          </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import uploadPhoto from "../../tools/uploadPhoto";
import drainageList from "../../tools/drainageList";
import editor from "../../tools/editor";
export default {
  name: "addGoods",
  components: {
    uploadPhoto,
    drainageList,
    editor
  },
  data() {
    var validateStock = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      } else if ((value + "").indexOf(".") > -1) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    var validatePrice = (rule, value, callback) => {
      var reg = /^(-?\d+)(\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error("请保证输入数字规范并保证小数点后最多两位"));
      }
    };
    var validateActivy = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正整数"));
      } else if (value > 99 || value < 1) {
        callback(new Error("任务时长应在1-99个小时之内"));
      } else {
        callback();
      }
    };
    return {
      taskRadio: 0,
      activeStep: 0,
      firstDis: false,
      submitDis: false,
      loading: false,
      loadingTimer: null,
      formatTitle: "新增规格",
      drainageChoose: {
        id: "",
        type: ""
      },
      goodsProp: {
        value: "id",
        label: "name"
      },
      goodsForm: {
        drainageWord: "", //搭配转发语
        shortTitle: "", //商品简称
        title: "", //商品标题
        coding: "", //商品SKU编码
        goodsPhoto: {
          text: "添加商品主图（注:必须上传，限制:1-4张，尺寸:800*800像素）",
          length: 4,
          file: []
        },
        forwardSentence: "我发现了超值宝贝，快来看看吧！", //转发语
        coverPhoto: {
          text: "转发封面（注:必须上传，限制:最多1张，尺寸:400*320像素）",
          length: 1,
          file: []
        },
        formatData: [], //规格数据
        detail: "", //商品详情
        formatIndex: -1,
        drainage: "请选择", //引流搭配
        activy: "", //活动
        activyTime: 24, //默认活动时长
        activyContent: [
          {
            id: "",
            duration: 24,
            goodsId: "",
            target: 10,
            percent: 2,
            createTime: "",
            status: 0
          },
          {
            id: "",
            duration: 24,
            goodsId: "",
            target: 20,
            percent: 3,
            createTime: "",
            status: 0
          },
          {
            id: "",
            duration: 24,
            goodsId: "",
            target: 50,
            percent: 5,
            createTime: "",
            status: 0
          }
        ],
        selectedOptions: [] //选择的商品类目值
      },
      goodsFormRules: {
        shortTitle: [
          { required: true, message: "请输入商品简称", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请输入商品标题", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "商品标题应为1-30个字符",
            trigger: "blur"
          }
        ],
        selectedOptions: [
          { required: true, message: "请选择商品类目", trigger: "blur" }
        ],
        detail: [
          { required: true, message: "请输入商品详情", trigger: "blur" }
        ],
        format: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
          {
            min: 1,
            max: 12,
            message: "规格名称应为12个字符以下",
            trigger: "blur"
          }
        ],
        stock: [
          { required: true, message: "请输入库存", trigger: "blur" },
          { validator: validateStock, trigger: "blur" }
        ],
        sellPrice: [
          { required: true, message: "请输入销售价格", trigger: "blur" },
          { validator: validatePrice, trigger: "blur" }
        ],
        marketPrice: [{ validator: validatePrice, trigger: "blur" }],
        activyTime: [
          { required: true, message: "请输入任务时长", trigger: "blur" },
          { validator: validateActivy, trigger: "blur" }
        ],
        forwardSentence: [
          { min: 1, max: 30, message: "转发语应为1-30个字符", trigger: "blur" }
        ],
        int: [{ type: "number", message: "请输入数字", trigger: "blur" }]
      },
      targetDisable: true,
      targetBtnTxt: "修改",
      activy: 0, //默认选择第一个活动
      activyList: [], //活动列表
      isShowTask: false, //是否显示推荐有奖相关内容
      taskTime: "", //任务时间
      taskTxt: "修改",
      taskStatus: true,
      formatDialog: false, //新增规格对话框显示
      formatForm: { format: "", sellPrice: "", marketPrice: "", stock: "" },
      drainageDialog: false, //引流商品窗口显示
      options: [
        /*{value: 'zhinan',label: '指南',children: []}*/
      ],
      //引流品的表头信息
      drainageInfo: {
        number: "",
        name: "",
        select: "",
        totalPage: ""
      },
      drainageData: [], //引流品列表数据
      drainageDetailDialog: false, //引流品详情弹窗显示
      isShowDrainage: false, //是否显示引流品搭配
      goodsPhotoPath: [],
      coverPhotoPath: "",
      goodsInfoDetail: { goodsTarget: [] },
      allClass: [], //全部类目
      selectDrainage: {}
    };
  },
  computed: {
    drainageWordShow() {
      if (this.goodsForm.drainage != "请选择") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    //切换满减活动
    changeSelect() {
      if (this.activy != 0) {
        this.taskRadio = 0;
        this.isShowTask = false;
      }
    },
    //切换任务活动
    changeSelectTask() {
      if (this.taskRadio != 0) {
        this.activy = 0;
        this.isShowTask = true;
      } else {
        this.isShowTask = false;
      }
    },
    //提交商品第二步
    submit() {
      if (this.activy == 0 && this.taskRadio == 0) {
        this.goodsInfoDetail.activityType = 0;
        this.goodsInfoDetail.activityId = 0;
      } else if (this.activy == 0 && this.taskRadio != 0) {
        if (this.goodsForm.activyTime == "") {
          this.$message({ type: "warning", message: "请填写任务时长" });
          return;
        }
        if (!/^[0-9]+$/.test(this.goodsForm.activyTime)) {
          this.$message({ type: "warning", message: "任务时长应为正整数" });
          return;
        }
        if (this.goodsForm.activyTime > 99 || this.goodsForm.activyTime < 1) {
          this.$message({ type: "warning", message: "任务时长应为1-99个小时" });
          return;
        }
        if (this.targetDisable == false) {
          this.$message({ type: "error", message: "任务内容未保存!" });
          return;
        }
        this.goodsInfoDetail.activityType = 1;
        this.goodsInfoDetail.activityId = 0;
        this.goodsInfoDetail.goodsTarget = this.goodsForm.activyContent;
        this.goodsInfoDetail.goodsTarget.forEach((item, index) => {
          item.duration = parseInt(this.goodsForm.activyTime * 3600 * 1000);
          item.target = parseInt(this.goodsForm.activyContent[index].target);
          item.percent = parseInt(
            this.goodsForm.activyContent[index].percent
          );
        });
      } else if (this.activy != 0 && this.taskRadio == 0) {
        this.goodsInfoDetail.activityType = 2;
        this.goodsInfoDetail.activityId = this.activy;
        this.goodsInfoDetail.goodsTarget = [];
      }
      if (this.goodsForm.drainageWord.length != 0) {
        if (
          !this.$filterWord(
            this.goodsForm.drainageWord,
            this.$store.state.filterList
          )
        ) {
          this.$message({
            type: "error",
            message: "搭配转发语包含敏感词汇，请重试"
          });
          return;
        }
      }
      this.submitDis = true;
      this.$http
        .post(
          "/szmktstore/goodsInfo/activity/save?goodsId=" +
            this.$store.state.goodsId +
            "&activityType=" +
            this.goodsInfoDetail.activityType +
            "&activityId=" +
            this.goodsInfoDetail.activityId +
            "&relay=" +
            this.goodsForm.drainageWord +
            "&collocationId=" +
            this.drainageChoose.id +
            "&collocationType=" +
            this.drainageChoose.type,
          this.goodsInfoDetail.goodsTarget
        )
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({ type: "success", message: "活动设置提交成功!" });
            this.$router.push({ name: "submitResult", query: { type: 0 } });
          } else {
            this.$message({ type: "error", message: res.data.message });
            this.submitDis = false;
          }
        });
    },
    //删除表格行
    deleteRow(index, rows) {
      this.$confirm("是否确定删除该规格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rows.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加规格
    addFormat() {
      this.formatTitle = "新增规格";
      this.goodsForm.formatIndex = -1;
      this.formatForm.format = "";
      this.formatForm.sellPrice = "";
      this.formatForm.marketPrice = "";
      this.formatForm.stock = "";
      this.formatDialog = true;
    },
    //提交规格
    submitFormat() {
      let reg = /^(-?\d+)(\.\d{1,2})?$/;
      let regNum = /^[0-9]*$/;

      if (this.formatForm.format + "" == "") {
        this.$message({ type: "warning", message: "请输入规格名称" });
      } else {
        if (this.formatForm.format.length > 12) {
          this.$message({
            type: "warning",
            message: "规格名称应为12个字符以下"
          });
          return;
        }
        if (
          !this.$filterWord(
            this.formatForm.format,
            this.$store.state.filterList
          )
        ) {
          this.$message({
            type: "error",
            message: "规格名称包含敏感词汇，请重试"
          });
          return;
        }
        if (
          this.formatForm.stock + "" == "" ||
          !regNum.test(this.formatForm.stock + "")
        ) {
          this.$message({
            type: "warning",
            message: "请输入库存并确保为0或0以上的整数"
          });
        } else {
          if (
            this.formatForm.sellPrice == "" ||
            !reg.test(this.formatForm.sellPrice)
          ) {
            this.$message({
              type: "warning",
              message: "请输入销售价格并确保小数点后最多两位"
            });
          } else {
            if (this.formatForm.marketPrice != "") {
              if (!reg.test(this.formatForm.marketPrice)) {
                this.$message({
                  type: "warning",
                  message: "请确保市场保持小数点后最多两位"
                });
                return;
              }
              if (
                this.formatForm.sellPrice - 0 >
                this.formatForm.marketPrice - 0
              ) {
                this.$message({
                  type: "error",
                  message: "销售价格不得大于市场价格"
                });
                return;
              }
              var marketPrice = Math.round(this.formatForm.marketPrice * 100);
            } else {
              var marketPrice = this.formatForm.marketPrice;
            }
            if (this.goodsForm.formatIndex != -1) {
              this.goodsForm.formatData[this.goodsForm.formatIndex] = {
                className: this.formatForm.format,
                stock: this.formatForm.stock - 0,
                salPrice: Math.round(this.formatForm.sellPrice * 100),
                mktPrice: marketPrice,
                addTime: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .addTime,
                channelCollocation: this.goodsForm.formatData[
                  this.goodsForm.formatIndex
                ].channelCollocation,
                channelInfo: this.goodsForm.formatData[
                  this.goodsForm.formatIndex
                ].channelInfo,
                cover: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .cover,
                delTime: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .delTime,
                id: this.goodsForm.formatData[this.goodsForm.formatIndex].id,
                goodsId: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .goodsId,
                goodsName: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .title,
                minPrice: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .minPrice,
                status: this.goodsForm.formatData[this.goodsForm.formatIndex]
                  .status
              };
              this.$message({
                type: "info",
                message: "编辑规格成功"
              });
            } else {
              this.goodsForm.formatData.push({
                className: this.formatForm.format,
                stock: this.formatForm.stock - 0,
                salPrice: Math.round(this.formatForm.sellPrice * 100),
                mktPrice: marketPrice,
                addTime: 0,
                channelCollocation: null,
                channelInfo: null,
                cover: null,
                delTime: 0,
                id: null,
                goodsId: "",
                goodsName: "",
                minPrice: null,
                status: 0
              });
              this.$message({
                type: "info",
                message: "新增规格成功"
              });
            }
            this.formatDialog = false;
            this.goodsForm.formatIndex = -1;
          }
        }
      }
    },
    //改变引流品
    changeDrainage(data) {
      this.drainageData = data;
    },
    //获取选择的商品类目
    getType(value) {
      console.log(this.options);
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i]["id"] == value[0]) {
          for (let j = 0; j < this.options[i]["children"].length; j++) {
            if (this.options[i]["children"][j]["id"] == value[1]) {
              for (
                let k = 0;
                k < this.options[i]["children"][j]["children"].length;
                k++
              ) {
                if (
                  this.options[i]["children"][j]["children"][k]["id"] ==
                  value[2]
                ) {
                  this.goodsInfoDetail.classifyId = this.options[i]["children"][
                    j
                  ]["children"][k]["id"];
                }
              }
            }
          }
        }
      }
    },
    //打开引流品列表
    openDrainage() {
      this.$http
        .get(
          "szmktbackstage/channel/ratio/search?page=0&size=10&userid=" +
            this.$store.state.loginInfo.userId +
            "&goodsId=" +
            this.$store.state.goodsId
        )
        .then(res => {
          if (res.data.code == 1000) {
            this.drainageData = res.data.data.content;
            this.drainageData.forEach((item, index) => {
              item.pageIndex = index + 1;
            });
            this.drainageInfo.number = res.data.data.totalElements;
            this.drainageInfo.totalPage = res.data.data.totalPages;
            this.drainageDialog = true;
          } else {
            this.$message({ type: "error", message: res.data.message });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //关闭引流品对话框
    closeDrainageDialog() {
      this.drainageDialog = false;
    },
    //提交引流品选择
    submitDrainage(select, info) {
      this.selectDrainage = select;
      this.drainageChoose = info;
      if (select != "") {
        this.goodsForm.drainage = "已选择  " + select;
      } else {
        this.goodsForm.drainage = "请选择";
        this.goodsForm.drainageWord = "";
      }
    },
    //加载活动列表
    loadActivty() {
      this.$http
        .get(
          "szmktbackstage/couponActivity/list?userid=" +
            this.$store.state.loginInfo.userId
        )
        .then(res => {
          if (res.data.code == 1000) {
            this.activyList = [];
            res.data.data.forEach((item, index) => {
              this.activyList.push({
                label: item.id,
                title: "满" + item.standard / 100 + "减" + item.privilege / 100
              });
            });
          } else {
            this.$message({ type: "error", message: res.data.message });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //加载商品类目
    loadGoodsClass() {
      this.$http
        .get(
          "szmktbackstage/goodsClassify/tree?userid=" +
            this.$store.state.loginInfo.userId
        )
        .then(res => {
          if (res.data.code == 1000) {
            this.allClass = res.data.data;
            this.options = res.data.data;
            this.options.forEach(item => {
              item.children.forEach(item1 => {
                item1.children.forEach(item2 => {
                  item2.children = "";
                  item2.name = item2.name +"(佣金比例：" + item2.description + ")";
                });
              });
            });
          } else {
            this.$message({ type: "error", message: res.data.message });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //编辑任务
    editTarget() {
      if (this.targetBtnTxt == "修改") {
        this.targetBtnTxt = "保存";
        this.targetDisable = false;
      } else {
        var reg = /^[0-9]+$/;
        let activityPass = 0;
        this.goodsForm.activyContent.forEach((item, index) => {
          if (!reg.test(item.target) || item.target < 1) {
            this.$message({
              type: "error",
              message: "保存错误，任务人数只能为正整数"
            });
            activityPass++;
            return;
          }
          if (
            !reg.test(item.percent) ||
            item.percent > 99 ||
            item.percent < 1
          ) {
            this.$message({
              type: "error",
              message: "保存错误，赏金比例只能为正整数且不大于100"
            });
            activityPass++;
            return;
          }
        });
        if (activityPass == 0) {
          this.$message({
            type: "success",
            message: "保存成功",
            duration: 800
          });
          this.targetBtnTxt = "修改";
          this.targetDisable = true;
        }
      }
    },
    //添加货物图片
    addGoodsPhoto(res, name) {
      this.goodsPhotoPath.push(res.data.data);
      this.goodsForm.goodsPhoto.file.push({
        name: name,
        url: this.$filePath.photo + res.data.data
      });
    },
    addCoverPhoto(res) {
      this.coverPhotoPath = res.data.data;
    },
    //删除不合格的商品图片
    removeGoodsPhoto(index) {
      this.goodsPhotoPath.splice(index, 1);
      this.goodsForm.goodsPhoto.file.splice(index, 1);
    },
    //删除封面照片
    removeCoverPhoto() {
      this.coverPhotoPath = "";
      this.goodsForm.coverPhoto.file.pop();
    },
    //添加商品详情里的图片
    addEditorPhoto(text) {
      this.goodsForm.detail = text;
    },
    //编辑规格
    editFormat(row, index) {
      this.formatTitle = "编辑规格";
      this.goodsForm.formatIndex = index;
      this.formatDialog = true;
      this.formatForm.format = row.className;
      this.formatForm.stock = row.stock;
      this.formatForm.sellPrice = row.salPrice / 100;
      if (row.mktPrice != "" && row.mktPrice != null) {
        this.formatForm.marketPrice = row.mktPrice / 100;
      } else {
        this.formatForm.marketPrice = 0;
      }
    },
    //第一步提交
    finishFirst() {
      if (this.goodsForm.title == "") {
        this.$message({ type: "warning", message: "请填写商品标题" });
        return;
      }
      if (this.goodsForm.shortTitle == "") {
        this.$message({ type: "warning", message: "请填写商品简称" });
        return;
      }
      if (
        !this.$filterWord(this.goodsForm.title, this.$store.state.filterList)
      ) {
        this.$message({
          type: "error",
          message: "商品标题包含敏感词汇，请重试"
        });
        return;
      }
      if (
        !this.$filterWord(
          this.goodsForm.shortTitle,
          this.$store.state.filterList
        )
      ) {
        this.$message({
          type: "error",
          message: "商品简称包含敏感词汇，请重试"
        });
        return;
      }
      if (this.goodsForm.selectedOptions.length == 0) {
        this.$message({ type: "warning", message: "请选择商品类目" });
        return;
      }
      if (this.goodsForm.coding.length != 0) {
        if (
          !this.$filterWord(this.goodsForm.coding, this.$store.state.filterList)
        ) {
          this.$message({
            type: "error",
            message: "商品编码包含敏感词汇，请重试"
          });
          return;
        }
      }
      if (this.goodsPhotoPath.length == 0) {
        this.$message({ type: "error", message: "请至少上传一张商品主图" });
        return;
      }
      if (this.goodsForm.detail == "") {
        this.$message({ type: "error", message: "请输入商品详情" });
        return;
      }
      if (
        !this.$filterWord(this.goodsForm.detail, this.$store.state.filterList)
      ) {
        this.$message({
          type: "error",
          message: "商品详情包含敏感词汇，请重试"
        });
        return;
      }
      if (this.coverPhotoPath.length == 0) {
        this.$message({ type: "error", message: "请上传转发封面" });
        return;
      }
      if (this.goodsForm.formatData.length == 0) {
        this.$message({ type: "warning", message: "请添加商品规格" });
        return;
      }
      this.goodsInfoDetail.classifyId = this.goodsForm.selectedOptions[2];
      this.goodsInfoDetail.title = this.goodsForm.title;
      this.goodsInfoDetail.sku = this.goodsForm.coding;
      this.goodsInfoDetail.picUrls = this.goodsPhotoPath;
      if (this.goodsForm.forwardSentence == "") {
        this.goodsForm.forwardSentence = "我发现了超值宝贝，快来看看吧！";
      } else {
        if (
          !this.$filterWord(
            this.goodsForm.forwardSentence,
            this.$store.state.filterList
          )
        ) {
          this.$message({
            type: "error",
            message: "转发语包含敏感词汇，请重试"
          });
          return;
        }
      }
      this.goodsInfoDetail.relay = this.goodsForm.forwardSentence;
      this.goodsInfoDetail.cover = this.coverPhotoPath;
      this.goodsInfoDetail.description = this.goodsForm.detail;
      this.goodsInfoDetail.goodsClass = this.goodsForm.formatData;
      this.goodsInfoDetail.shortTitle = this.goodsForm.shortTitle;
      this.firstDis = true;
      this.$http
        .post(
          "/szmktstore/goodsInfo/base/save?userid=" +
            this.$store.state.loginInfo.userId,
          this.goodsInfoDetail
        )
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "保存成功！",
              duration: 300
            });
            this.$store.commit("changeGoodsId", res.data.data.id);
            this.activeStep = 1;
          } else {
            this.$message({ type: "error", message: res.data.message });
            this.firstDis = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    number(value, index) {
      if (value == "stock") {
        if (isNaN(this.formatForm[value])) {
          this.formatForm[value] = "";
        } else if (this.formatForm[value] - 0 < 0) {
          this.formatForm[value] = "";
        } else if ((this.formatForm[value] + "").indexOf(".") > -1) {
          this.formatForm[value] = "";
        }
      } else if (value == "sellPrice" || value == "marketPrice") {
        var reg = /^(-?\d+)(\.\d{1,2})?$/;
        if (isNaN(this.formatForm[value])) {
          this.formatForm[value] = "";
        } else if (!reg.test(this.formatForm[value] - 0)) {
          this.formatForm[value] = "";
        } else if (this.formatForm[value] - 0 < 0) {
          this.formatForm[value] = "";
        }
      } else if (value == "activyTime") {
        var reg = /^[0-9]*$/;
        if (isNaN(this.goodsForm[value])) {
          this.goodsForm[value] = "";
        } else if (!reg.test(this.goodsForm[value] - 0)) {
          this.goodsForm[value] = "";
        } else if (
          this.goodsForm[value] - 0 <= 0 ||
          this.goodsForm[value] - 0 > 99
        ) {
          this.goodsForm[value] = "";
        }
      } else if (value == "target" || value == "percent") {
        var reg = /^[0-9]*$/;
        if (isNaN(this.goodsForm.activyContent[index][value])) {
          this.goodsForm.activyContent[index][value] = "";
        } else if (!reg.test(this.goodsForm.activyContent[index][value] - 0)) {
          this.goodsForm.activyContent[index][value] = "";
        } else if (
          this.goodsForm.activyContent[index][value] - 0 <= 0 ||
          this.goodsForm.activyContent[index][value] - 0 > 99
        ) {
          this.goodsForm.activyContent[index][value] = "";
        } else if (
          (this.goodsForm.activyContent[index][value] + "").indexOf(".") > -1
        ) {
          this.goodsForm.activyContent[index][value] = "";
        }
      }
    },
  },
  mounted() {
    let _this = this;
    this.loadActivty();
    this.loadGoodsClass();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.addGoods {
  padding: 20px;
  margin-bottom: 15px;
  position: relative;
  .secTitle {
    line-height: 50px;
    font-size: 16px;
    text-align: left;
    font-weight: bold;
    text-indent: 30px;
  }
  .step {
    overflow: hidden;
    position: relative;
    .title {
      margin: 0 0 10px 0;
      line-height: 45px;
      text-align: left;
      font-size: 16px;
      border-bottom: 1px solid #E5E8ED;
      font-weight: bold;
    }
    .title-item {
      line-height: 50px;
      text-align: left;
      font-size: 14px;
    }
    .title-tip{
      padding-left: 40px;
      color: #ABB2C0;
      font-size: 12px;
      line-height: 50px;
      background: url(../../../assets/img/request.png) 20px center no-repeat;
      background-size: 12px 12px; 
    }
  }
  .step:nth-child(2) {
    padding-bottom: 10px;
    margin-bottom: 15px;
    .tips {
      width: 100px;
      float: left;
      font-size: 0.28rem;
      line-height: 50px;
      text-align: left;
      .red {
        color: red;
      }
    }
  }
  .task {
    position: relative;
  }
  .introduce::after {
    content: "";
    display: block;
    width: 100%;
    height: 0;
    clear: both;
  }
  .introduce {
    width: 1200px;
    padding: 20px 0 30px 0;
    margin-bottom: 50px;
    .introduceTitle {
      width: 100px;
      float: left;
      line-height: 45px;
      text-align: left;
      font-size: 0.28rem;
      line-height: 60px;
      .red {
        color: red;
      }
    }
    .introduceContent {
      box-sizing: border-box;
      float: left;
      width: calc(100% - 100px);
      margin-left: 15px;
    }
  }
  .drainageWord {
    display: flex;
    line-height: 40px;
    margin: 10px 0;
    font-size: 14px;
    .drainageWord-title {
      float: left;
      text-align: left;
      width: 350px;
      span {
        display: block;
      }
    }
    .drainageWord-content {
        float: left;
        width: calc(100% - 350px);
        .drainageWord-content-input{
            width: 100%;
        }
    }
  }
  .stepControl{
    width:100%;
    box-sizing:border-box;
    margin:10px 0 20px;
    padding:20px 10px;
    background:white;
    border-radius: 5px;
  }
  .redStar{
    color: #FF6B6B;
    font-size: 14px;
    padding-right:10px;
    line-height: 40px;
  }
  .content-panel{
    background-color: white;
    padding:10px 0 10px 20px;
    margin-bottom: 15px;
    border-radius: 5px;
    overflow: hidden;
  }
  .el-form-item{
    margin-bottom: .1rem;
  }
  .formatForm{
    .el-form-item{
      margin-bottom: .4rem;
    }
  }
  .operateBox{
    display: flex;
    justify-content: center;
    align-items: center;
    .operateBtn{
      padding: 0 5px;
      border-radius: 5px;
      margin: 0 5px;
      line-height: 25px;
      cursor: pointer;
    }
    .errorBtn{
      border: 1px solid #FF6B6B;
      color: #FF6B6B;
    }
    .primaryBtn{
      border: 1px solid #418EFE;
      color: #418EFE;
    }
    .errorBtn:hover{
      background-color: #FF6B6B;
      color: white;
    }
    .primaryBtn:hover{
      background-color: #418EFE;
      color: white;
    }
  }
}
</style>
