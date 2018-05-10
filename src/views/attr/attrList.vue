<template><div>
<Card>
    <Form :model="queryForm" :label-width="80">
        <Row>
            <Col span="6">
                <FormItem label="标签" prop="label">
                    <Input type="text" v-model="queryForm.label"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem label="名字" prop="name">
                    <Input type="text" v-model="queryForm.name"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem label="类型" prop="type">
                    <Input type="text" v-model="queryForm.type"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem label="长度" prop="length">
                    <Input type="text" v-model="queryForm.length"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem label="精度" prop="precise">
                    <Input type="text" v-model="queryForm.precise"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem label="默认值" prop="defaultValue">
                    <Input type="text" v-model="queryForm.defaultValue"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="7" style="text-align: center; margin-bottom: -15px;">
                <FormItem>
                    <Button type="primary" icon="android-search" @click="doQuery">查询</Button>
                    <Button type="error" icon="android-refresh" @click="doClear">清空</Button>
                    <Button type="error" icon="android-refresh" @click="$router.go(-1)">返回</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
</Card>
<Modal width="1000" v-model="saveModal.show" loading @on-ok="doSave" :title="saveModal.title">
        <Form :model="saveForm" :label-width="100" >
        <Row>
            <Col span="8">
                <FormItem label="属性名称" prop="name">
                    <Input type="text" v-model="saveForm.name" placeholder="请输入标签"></Input>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="属性Code" prop="code">
                    <Input type="text" v-model="saveForm.code" placeholder="请输入属性Code"></Input>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="必填" prop="required">
                    <i-switch v-model="saveForm.required">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                    </i-switch>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="页面控件类型" prop="type">
                    <Select v-model="saveForm.type" clearable placeholder="请选择类型">
                        <Option v-for="item in dict.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="16">
                <FormItem label="字典" v-if="saveForm.type == 'enum' || saveForm.type == 'select' || saveForm.type == 'radio'" prop="dict.id">
                    <Select v-model="saveForm.dict.id" clearable placeholder="请选择字典">
                        <Option v-for="item in dict.dict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="数据类型" prop="datatype">
                    <Select v-model="saveForm.datatype" clearable placeholder="请选择数据类型">
                        <Option v-for="item in dict.datatype" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="长度" prop="length">
                    <Input type="text" v-model="saveForm.length" placeholder="请输入长度"></Input>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="精度" prop="precise">
                    <Input type="text" v-model="saveForm.precise" placeholder="请输入精度"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="默认值" prop="defaultValue">
                    <Input type="text" v-model="saveForm.defaultValue" placeholder="请输入默认值"></Input>
                </FormItem>
            </Col>
            <Col span="8">
                <FormItem label="数据库列" prop="dbFlag">
                    <i-switch v-model="saveForm.dbFlag">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
            </Col>
            <Col span="8" v-if="saveForm.dbFlag == 1">
                <FormItem label="索引" prop="dbIdxFlag">
                    <i-switch v-model="saveForm.dbIdxFlag">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="16">
                <FormItem label="备注" prop="remark">
                    <Input type="textarea" v-model="saveForm.remark" placeholder="请输入备注"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem label="操作项" prop="optIds">
                    <CheckboxGroup v-model="saveForm.optIds">
                        <Checkbox v-for="opt in saveModal.opts" :key="opt.id" :label="opt.id">{{ opt.name }}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Col>
        </Row>
    </Form>
</Modal>
<Card>
<Button type="primary" icon="plus" style="margin-bottom: 5px; margin-top: -10px; text-align:right;" @click="showModalAdd">添加</Button>
    <Table :columns="columnsList" :data="tableData" border></Table>
    <div style="text-align: right; padding-top: 10px;">
        <Page :total="page.total" :current="page.current" :page-size="page.size" show-total show-elevator @on-change="changePage">
            总计 {{page.total}} 条
        </Page>
    </div>
</Card>
</div></template>
<script>
import util from '@/libs/util';
export default {
    data () {
        return {
            fid: '',
            saveModal: {
                show: false,
                title: '',
                opts: []
            },
            queryForm: {
                name: '',
                code: '',
                type: '',
                length: '',
                precise: '',
                defaultValue: '',
            },
            saveForm: {
                name: '',
                code: '',
                type: '',
                datatype: '',
                required: false,
                length: '',
                precise: '',
                defaultValue: '',
                textarea: '',
                id: '',
                dbFlag: '',
                dbIdxFlag: '',
                remark: '',
                optIds: [],
                opts: [],
                dict: {
                    id: ''
                }
            },
            columnsList:[
                {
                    title: '属性名称',
                    key: 'name',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '属性Code',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '页面控件类型',
                    key: 'type',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        let value = this.dict.type.filter(item => {
                            return params.row.type == item.value
                        }).map(item => {
                            return item.label
                        }) + '【' + params.row.type + '】';
                        return h('span', value);
                    },
                },
                {
                    title: '数据类型',
                    key: 'datatype',
                    align: 'center',
                    render: (h, params) => {
                        let value = this.dict.datatype.filter(item => {
                            return params.row.datatype == item.value;
                        }).map(item => {
                            return item.label;
                        });
                        return h('span', value);
                    },
                },
                {
                    title: '长度',
                    key: 'length',
                    align: 'center'
                },
                {
                    title: '精度',
                    key: 'precise',
                    align: 'center'
                },
                {
                    title: '必填',
                    key: 'required',
                    width: 70,
                    align: 'center',
                    render: (h, params) => {
                        let value = this.dict.required.filter(item => params.row.required == item.value).map(item => item.label);
                        return h('span', value);
                    },
                },
                {
                    title: '默认值',
                    key: 'defaultValue',
                    align: 'center'
                },
                {
                    title: '数据库列',
                    key: 'dbFlag',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('Icon', {
                            props: {
                                type: params.row.dbFlag == '1' ? "ios-checkmark" : "ios-close-outline",
                                class: "ivu-icon",
                            },
                            style: {
                                fontSize: '24px',
                            }
                        });
                    },
                },
                {
                    title: '索引',
                    key: 'dbIdxFlag',
                    width: 70,
                    align: 'center',
                    render: (h, params) => {
                        return h('Icon', {
                            props: {
                                type: params.row.dbIdxFlag == '1' ? "ios-checkmark" : "ios-close-outline",
                                class: "ivu-icon",
                            },
                            style: {
                                fontSize: '24px',
                            }
                        });
                    },
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 220,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'document',
                                    size: 'small'
                                },
                                style: {
                                      marginRight: '5px'
                                },
                                on: {
                                      click: () => {
                                         let argu = { order_id: params.row.order_id }
                                           //util.openNewPage(this, 'order_info', argu);
                                           this.$router.push({
                                               name: 'order_info',
                                               params: argu
                                           })
                                       }
                                   }
                            }, '详情'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'compose',
                                    size: 'small'
                                },
                                style: {
                                      marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showModalUpdate(params.row.id)
                                    }
                                },
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'ios-trash-outline',
                                    size: 'small'
                                },
                                style: {
                                      marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doDelete(params.row.id)
                                    }
                                },
                            }, '删除'),
                        ])
                    }
                }
            ],
            tableData: [],
            page: {
                total: 0,
                size: 10,
                current: 1,
                num: 0
            },
            dict: {
                type: [
                    {
                        label: '文本（默认）',
                        value: 'text'
                    },
                    {
                        label: '日期时间',
                        value: 'datetime'
                    },
                    {
                        label: '日期',
                        value: 'date'
                    },
                    {
                        label: '文本域',
                        value: 'textarea'
                    },
                    {
                        label: '数值',
                        value: 'number'
                    },
                    {
                        label: '密码',
                        value: 'password'
                    },
                    {
                        label: '图片上传【单图】',
                        value: 'pic'
                    },
                    {
                        label: '图片上传【多图】',
                        value: 'pics'
                    },
                    {
                        label: '列表框（选择器）',
                        value: 'select'
                    },
                    {
                        label: '单选框',
                        value: 'radio'
                    }
                ],
                required: [
                    {
                        label: '否',
                        value: '0'
                    },
                    {
                        label: '是',
                        value: '1'
                    }
                ],
                dbFlag: [
                    {
                        label: '否',
                        value: '0'
                    },
                    {
                        label: '是',
                        value: '1'
                    }
                ],
                dbIdxFlag: [
                    {
                        label: '否',
                        value: '0'
                    },
                    {
                        label: '是',
                        value: '1'
                    }
                ],
                datatype: [
                    {
                        label: 'String(文本)',
                        value: 'string'
                    },
                    {
                        label: 'Integer(整数)',
                        value: 'int'
                    },
                    {
                        label: 'Long(长整数)',
                        value: 'long'
                    },
                    {
                        label: 'Double(浮点数)',
                        value: 'double'
                    },
                    {
                        label: 'Text(长文本)',
                        value: 'text'
                    },
                    {
                        label: 'Datetime(日期时间)',
                        value: 'datetime'
                    },
                ],
                dict: [],
            }
        }
    },
    mounted () {
        this.init();
        this.loadOpts();
        this.getDict();
    },
    methods: {
        init () {
            this.fid = this.$route.params.fid;
            this.clearPage();
            this.getList();
        },
        getDict() {
            let _self = this;
            util.ajax.get('/dict/listAll?fid=' + this.fid).then(res => {
                if (res.status === 200) {
                    if (res.data.code === "0") {
                        _self.dict.dict = res.data.content.map(item => {
                            let dictItems = item.dictItems.map(dictItem => dictItem.value + ':' + dictItem.name).toString()
                             return {
                                label: item.name + ' >> ' + dictItems,
                                value: item.id
                            }
                        })
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        doQuery() {
            this.clearPage();
            this.getList();
        },
        doClear () {
            this.queryForm.name = '';
            this.queryForm.code = '';
            this.queryForm.type = '';
            this.queryForm.datatype = '';
            this.queryForm.length = '';
            this.queryForm.precise = '';
            this.queryForm.defaultValue = '';
            this.doQuery();
        },
        doSave () {
            let _self = this;
            util.ajax.post('/attr/save?fid=' + this.fid, this.processSaveForm()).then(res => {
                _self.saveModal.show = false;
                _self.clearSaveForm();
                _self.$Message.info('操作成功');
                _self.getList();
              }).catch(err => {
                _self.saveModal.show = false;
              })

        },
        doDelete (id) {
            let _self = this;
            this.$Modal.confirm({
                title: '删除',
                content: '确定要删除？',
                loading: true,
                onOk: () => {
                    let _modal = this.$Modal
                    util.ajax.post('/attr/delete?id=' + id).then(res => {
                        _modal.remove();
                        if (res.status === 200) {
                            if (res.data.code === "0") {
                                _self.$Message.info('操作成功');
                                _self.getList();
                            }
                        }
                    }).catch(err => {
                        _modal.remove();
                        console.log(err);
                    })
                }
            })
        },
        getList () {
            let _self = this;
            util.ajax.get('/attr/list?fid=' + this.fid + '&page=' + this.page.num + '&size=' + this.page.size).then(res => {
                if (res.status === 200) {
                    if (res.data.code === "0") {
                        _self.tableData = res.data.content.content;
                        _self.page.total = res.data.content.totalElements;
                        _self.page.size = res.data.content.size;
                        _self.page.current = res.data.content.number + 1;
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        showModalAdd() {
            this.clearSaveForm();
            this.saveModal.title = '添加功能';
            this.saveModal.show = true;
        },
        processSaveForm() {
            let form = {
                id: this.saveForm.id,
                name: this.saveForm.name,
                code: this.saveForm.code,
                type: this.saveForm.type,
                datatype: this.saveForm.datatype,
                length: this.saveForm.length,
                precise: this.saveForm.precise,
                defaultValue: this.saveForm.defaultValue,
                remark: this.saveForm.remark,
                dict: this.saveForm.dict,
            }
            form.opts = this.saveForm.optIds.map(id => {
                return {
                    id: id
                }
            });
            form.required = this.saveForm.required === true ? 1 : 0;
            form.dbFlag = this.saveForm.dbFlag === true ? 1 : 0;
            form.dbIdxFlag = this.saveForm.dbIdxFlag === true ? 1 : 0;
            return form;
        },
        prepareSaveForm(form) {
            this.saveForm.id = form.id;
            this.saveForm.name = form.name;
            this.saveForm.code = form.code;
            this.saveForm.required = form.required === 1 ? true : false;
            this.saveForm.dbFlag = form.dbFlag === 1 ? true : false;
            this.saveForm.dbIdxFlag = form.dbIdxFlag === 1 ? true : false;
            this.saveForm.type = form.type;
            this.saveForm.datatype = form.datatype;
            this.saveForm.length = form.length;
            this.saveForm.precise = form.precise;
            this.saveForm.defaultValue = form.defaultValue;
            this.saveForm.remark = form.remark;
            if (form.dict == undefined) {
                this.saveForm.dict = {
                    id: ''
                };
            } else {
                this.saveForm.dict = form.dict;
            }
            this.saveForm.opts = form.opts;
            this.saveForm.optIds = form.opts.map(opt => opt.id);
        },
        showModalUpdate(id) {
            let _self = this;
            util.ajax.get('/attr/detail?id=' + id).then(res => {
                if (res.status === 200) {
                    if (res.data.code === "0") {
                        _self.prepareSaveForm(res.data.content);
                    }
                }
            }).catch(err => {
                console.log(err);
            })
            this.saveModal.show = true;
            this.saveModal.title = '修改功能';
        },
        loadOpts () {
            let _self = this
            util.ajax.get('/opt/listAll?fid=' + this.fid).then(res => {
                if (res.status === 200) {
                    if (res.data.code === "0") {
                        _self.saveModal.opts = res.data.content.filter(opt => opt.type == 'add' || opt.type == 'update' || opt.type == 'detail' || opt.type == 'query' || opt.type == 'list' || opt.type == 'save')
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        clearSaveForm () {
            this.saveForm.name = '';
            this.saveForm.code = '';
            this.saveForm.type = '';
            this.saveForm.datatype = '';
            this.saveForm.required = false;
            this.saveForm.length = '';
            this.saveForm.precise = '';
            this.saveForm.defaultValue = '';
            this.saveForm.id = '';
            this.saveForm.optIds = [];
            this.saveForm.opts = [];
            this.saveForm.dict.id = '';
            this.saveForm.remark = '';
        },
        clearPage () {
            this.page.size = 10;
            this.page.current = 1;
            this.page.num = 0;
        },
        changePage (number) {
            this.page.num = number - 1;
            this.getList();
        }
    }
}
</script>
