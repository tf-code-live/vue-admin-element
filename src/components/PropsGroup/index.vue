<template>
    <div class="propsGroup">
        <!-- {{properties}} -->
        <div class="props">
            <p class="props-title">
                模型属性
            </p>
            <draggable
                class="props-box"
                :list="properties"
                chosen-class="active-prop"
                :group="{ name: 'propGroup', pull: 'clone', put: false }"
                :clone="cloneDog"
                :sort="false"
            >
                <span
                    v-for="(item, i) in properties"
                    :key="i"
                    class="props-box-item hover-prop"
                >{{ item.propertyName }}</span>
            </draggable>
        </div>
        <div class="dragArea">
            <div class="btnZone">
                <el-input
                    ref="inputName"
                    v-model="groupName"
                    placeholder="请输入组名" 
                    @keyup.native.enter="addNewGroup"
                />
                <el-button
                    plain
                    @click="addNewGroup"
                >
                    添加新的分组
                </el-button>
                <el-button
                    type="primary"
                    plain
                    @click="saveGroup"
                >
                    保存分组
                </el-button>
            </div>
            <div class="propZone">
                <div
                    v-for="(group, i) in groupList"
                    :key="i"
                    class="group-item"
                >
                    <div class="group-item-title">
                        <el-input
                            v-if="group.isEdit"
                            ref="inputGroup"
                            v-model="editGroupName"
                            @keyup.native.enter="$event.target.blur"
                            @blur="editName(i, group.groupName)"
                        />
                        <span
                            v-else
                            class="group-name"
                            @dblclick="changeGroupName(i, group.groupName)"
                        >{{ group.groupName }}</span>
                        <el-popconfirm
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除当前分组吗？"
                            @confirm="deleteGroup(i, group.propsList)"
                        >
                            <el-tooltip
                                slot="reference"
                                class="item"
                                effect="dark"
                                content="删除分组"
                                placement="top"
                            >
                                <i
                                    v-if="group.groupName !== '基础属性'"
                                    class="el-icon-delete"
                                    style="color: #F56C6C"
                                />
                            </el-tooltip>
                        </el-popconfirm>
                    </div>
                    <div class="group-item-prop">
                        <draggable
                            class="group-item-draggable"
                            :list="group.propsList"
                            group="propGroup"
                            @change="(event) => {groupPropChange(event, group.propsList, group.groupName)}"
                        >
                            <span
                                v-for="(item, j) in group.propsList"
                                :key="j"
                                class="hover-prop"
                            >{{ item.propertyName }}</span>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable"
import { modelPropGroup } from '@/utils'

export default {
    components: {
        draggable
    },
    props: {
        properties: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            groupName: "",
            editGroupName: "",
            groupList: [
                {
                    groupName: "基础属性",
                    propsList: [
                        {
                            propertyID: "name",
                            propertyName: "机房名称",
                            propertyType: "singlechar",
                            required: false,
                            description: "",
                            creator: "system",
                            editor: "system",
                            createTime: "Fri, 12 Nov 2021 02:20:23 -0000",
                            updateTime: "Fri, 19 Nov 2021 07:15:29 -0000",
                            modelID: "DCINFO",
                            options: [
                                {
                                    id: "",
                                    name: "",
                                    isDefault: false
                                }
                            ],
                            isFlag: true
                        },
                        {
                            propertyID: "roomAdmin",
                            propertyName: "机房管理员",
                            propertyType: "singlechar",
                            required: false,
                            description: "",
                            creator: "system",
                            editor: "system",
                            createTime: "Fri, 12 Nov 2021 02:21:02 -0000",
                            updateTime: "Fri, 19 Nov 2021 07:15:29 -0000",
                            modelID: "DCINFO",
                            options: [
                                {
                                    id: "",
                                    name: "",
                                    isDefault: false
                                }
                            ],
                            isFlag: false
                        },
                        {
                            propertyID: "state",
                            propertyName: "机房状态",
                            propertyType: "enum",
                            required: false,
                            description: "",
                            creator: "system",
                            editor: "system",
                            createTime: "Fri, 12 Nov 2021 02:22:21 -0000",
                            updateTime: "Fri, 12 Nov 2021 02:22:21 -0000",
                            modelID: "DCINFO",
                            options: [
                                {
                                    id: "ENABLE",
                                    name: "启用",
                                    isDefault: false
                                },
                                {
                                    id: "DISABLE",
                                    name: "关闭",
                                    isDefault: false
                                },
                                {
                                    id: "OTHER",
                                    name: "OTHER",
                                    isDefault: false
                                }
                            ],
                            isFlag: false
                        }
                    ],
                    isEdit: false
                },
                {
                    groupName: '数量',
                    propsList: [
                        {
                            propertyID: "rackCount",
                            propertyName: "机架数量",
                            propertyType: "integer",
                            required: false,
                            description: "",
                            creator: "system",
                            editor: "system",
                            createTime: "Fri, 12 Nov 2021 02:20:44 -0000",
                            updateTime: "Fri, 19 Nov 2021 07:15:19 -0000",
                            modelID: "DCINFO",
                            options: [
                                {
                                    id: "",
                                    name: "",
                                    isDefault: false
                                }
                            ],
                            isFlag: false
                        },
                        {
                            propertyID: "number",
                            propertyName: "数量",
                            propertyType: "integer",
                            required: false,
                            description: "",
                            creator: "system",
                            editor: "system",
                            createTime: "Mon, 15 Nov 2021 08:06:28 -0000",
                            updateTime: "Mon, 15 Nov 2021 08:06:28 -0000",
                            modelID: "DCINFO",
                            options: [
                                {
                                    id: "",
                                    name: "",
                                    isDefault: false
                                }
                            ],
                            isFlag: false
                        }
                    ],
                    isEdit: false
                }
            ]
        }
    },
    computed: {},
    created() {
        this.handleProperties(this.properties)
    },
    methods: {
        // 处理模型属性
        handleProperties(props) {
            this.groupList = modelPropGroup(props)
        },
        // 保存分组
        saveGroup() {
            this.$emit('saveGroup', this.groupList)
        },
        // 新增分组
        addNewGroup() {
            if (this.groupName !== '') {
                let isExit = this.groupList.some(g => g.groupName === this.groupName)
                if (isExit) {
                    this.sendNotification("warning", "警告", "当前分组中已存在该组名，请重新命名")
                    this.$refs['inputName'].focus()
                    return
                }
                this.groupList.push({
                    groupName: this.groupName,
                    propsList: [],
                    isEdit: false
                })
            }
            this.groupName = ''
            this.$refs['inputName'].blur()
        },
        // 删除分组
        deleteGroup(i, propsList) {
            this.groupList.splice(i, 1)
            if (propsList.length > 0) {
                this.groupList.forEach(g => {
                    if (g.groupName === '基础属性') {
                        g.propsList = [...g.propsList, ...propsList]
                    }
                })
            }
        },
        // 修改分组名
        editName(i, groupName) {
            let isExit = this.groupList.some(g => g.groupName === this.editGroupName)
            if (isExit&&groupName !== this.editGroupName) {
                this.sendNotification("warning", "警告", "当前分组中已存在该组名，请重新命名")
                this.editGroupName = groupName
                this.$refs['inputGroup'][0].focus()
            } else {
                this.groupList.forEach((item, idx) => {
                    if (i === idx) {
                        item.groupName = this.editGroupName
                        item.isEdit = false
                        this.editGroupName = ""
                    }
                })
            }
        },
        // 双击修改分组名
        changeGroupName(i, groupName) {
            if (groupName !== '基础属性') {
                this.groupList.forEach((item, idx) => {
                    if (i === idx) {
                        this.editGroupName = groupName
                        item.isEdit = true
                    }
                })
            }
        },
        groupPropChange(event, list, groupName) {
            if (event.added) {
                let {element, newIndex} = event.added
                let repeatList = list.filter(l => l.propertyName === element.propertyName)
                if (repeatList.length > 1) {
                    list.splice(newIndex, 1)
                    this.sendNotification("warning", "警告", "属性已在当前分组中，不能重复添加")
                    return
                }
                this.groupList.forEach(g => {
                    if (g.groupName !== groupName) {
                        g.propsList.forEach((p, i) => {
                            if (element.propertyName === p.propertyName) {
                                g.propsList.splice(i, 1)
                            }
                        })
                    }
                })
            }
        },
        cloneDog(item) {
            return item
        }
    }
}
</script>
<style lang='scss' scoped>
$themeColor: #1fb860;
$borderColor: #dfe4ed;
$propBgc: #f4f6fc;

@mixin acitve-hover-style {
    border: 1px dashed $themeColor;
    color: $themeColor;
}

.propsGroup {
    display: flex;
    .active-prop {
		@include acitve-hover-style;
    }
    .hover-prop {
        border: 1px solid transparent;
        &:hover {
		    @include acitve-hover-style;
        }
    }
    .props {
        width: 300px;
        border-right: 1px solid $borderColor;
        &-title {
            font-size: 18px;
            line-height: 48px;
            text-align: center;
            &::after {
                content: "";
                display: block;
                width: 100%;
                height: 1px;
                background: $borderColor;
                margin-bottom: 10px;
            }
        }
        .props-box {
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 10px;
            &-item {
                width: 47%;
                text-align: center;
                padding: 8px 5px;
                margin: 3px;
                background: $propBgc;
                cursor: move;
            }
        }
    }
    .dragArea {
        flex: 1;
        padding: 0 20px;
        .btnZone {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid $borderColor;
            .el-input {
                margin-right: 20px;
            }
        }
        .propZone {
            margin-top: 12px;
            .group-item {
                margin-bottom: 20px;
                &-title {
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .el-input {
                        margin-right: 20px;
                    }
                    .group-name {
                        cursor: pointer;
                    }
                }
                &-prop {
                    display: flex;
                    span {
                        margin: 3px;
                        padding: 5px;
                        display: inline-block;
                        background: $propBgc;
                        cursor: move;
                    }
                }
                &-draggable {
                    width: 100%;
                    padding: 10px;
                    border: 1px dashed $borderColor;
                }
            }
        }
    }
}
</style>