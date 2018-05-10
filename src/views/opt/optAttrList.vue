<style lang="less">
    @import '../../styles/common.less';
</style>
</style>
<template><div>
<Card>
    <p slot="title">选择操作属性</p>
    <Row>
        <Col span="12">
            <Card>
                <p slot="title">功能属性（待选）</p>
                <Table :columns="columnsListFunc" :data="tableDataFunc" border></Table>
            </Card>
        </Col>
        <Col span="12">
            <Card>
                <p slot="title">操作属性（已选）</p>
                <DragableTable refs="tableOpt" :columnsList="columnsListOpt" v-model="tableDataOpt" border @on-start="onStartSortTableOpt" @on-end="onEndSortTableOpt"></DragableTable>
            </Card>
        </Col>
    </Row>
    <Row>
        <Col span="24" style="text-align: center; margin-top: 10px;">
            <Button type="primary" icon="android-search" @click="doSave">保存</Button>
            <Button type="error" icon="android-refresh" @click="goBack">返回</Button>
        </Col>
    </Row>
</Card>
</div></template>
<script>
import util from '@/libs/util';
import DragableTable from '../components/tables/dragableTable.vue';

export default {
    components: {
        DragableTable
    },
    data () {
        return {
            fid: '',
            columnsListFunc: [
                {
                    title: '属性名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '属性Code',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'type',
                    align: 'center'
                },
                {
                    title: '备注',
                    key: 'remark',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'arrow-right-a',
                                    size: 'small'
                                },
                                style: {
                                    paddingLeft: '14px',
                                    paddingRight: '12px',
                                },
                                on: {
                                    click: () => {
                                        let attr = this.removeAttr(this.tableDataFunc, params.row.id)[0]
                                        this.tableDataOpt.push(attr)
                                    }
                                }
                            })
                        ])
                    }
                }
            ],
            columnsListOpt: [
                {
                    title: '属性名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '属性Code',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'type',
                    align: 'center'
                },
                {
                    title: '备注',
                    key: 'remark',
                    align: 'center'
                },
                {
                    title: '拖拽',
                    key: 'drag',
                    align: 'center',
                    render: (h) => {
                        return h(
                            'Icon',
                            {
                                props: {
                                    type: 'arrow-move',
                                    size: 24
                                }
                            }
                        );
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'left',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'arrow-left-a',
                                    size: 'small'
                                },
                                style: {
                                    paddingLeft: '14px',
                                    paddingRight: '12px',
                                },
                                on: {
                                    click: () => {
                                        let attr = this.removeAttr(this.tableDataOpt, params.row.id)[0]
                                        this.tableDataFunc.push(attr)
                                    }
                                }
                            })
                        ])
                    }
                }
            ],
            tableDataFunc: [],
            tableDataOpt: [],
            tableOpt: {
                hasDragged: false,
                isDragging: false,
                oldIndex: 0,
                newIndex: 0,
                draggingRecord: [],
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
                        label: '枚举（字典）',
                        value: 'enum'
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
                    }
                ]
            }
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.fid = this.$route.params.fid
            this.oid = this.$route.params.oid
            this.getAttrs()
        },
        getAttrs () {
            let _self = this
            util.ajax.get('/opt/attrs?oid=' + this.oid).then(res => {
                if (res.status === 200) {
                    if (res.data.code === "0") {
                        _self.tableDataOpt = res.data.content
                        util.ajax.get('/func/attrs?fid=' + _self.fid).then(res => {
                            if (res.status === 200) {
                                if (res.data.code === "0") {
                                    let attrs = res.data.content
                                    _self.tableDataFunc = attrs.filter(attrFunc => _self.tableDataOpt.findIndex(attrOpt => attrOpt.id == attrFunc.id) < 0)
                                }
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        doSave () {
            let aids = this.tableDataOpt.map(attr => attr.id)
            let _self = this
            util.ajax.post('/opt/bindAttr/' + this.oid, aids).then(res => {
                if (res.status === 200) {
                    if (res.data.code === "0") {
                        _self.$Message.info("操作成功")
                        _self.$router.go(-1)
                    } else {
                        _self.$Message.error(res.data.message)
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        goBack () {
            this.$router.go(-1)
        },
        removeAttr (attrs, id) {
            let i = attrs.findIndex(attr => attr.id == id);
            return attrs.splice(i, 1)
        },
        onStartSortTableOpt (from) {
            this.tableOpt.oldIndex = from;
            this.tableOpt.hasDragged = true;
            this.tableOpt.isDragging = true;
        },
        onEndSortTableOpt (e) {
            this.tableOpt.isDragging = false;
            this.tableOpt.draggingRecord.unshift({
                from: e.from + 1,
                to: e.to + 1
            });
        }
    }
}
</script>
