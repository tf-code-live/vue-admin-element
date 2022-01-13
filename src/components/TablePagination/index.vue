<template>
    <div class="mod-colstable">
        <!-- 表格上部搜索、导出等按钮、条件 -->
        <slot name="btn-header" />
        <!-- 表格以及分页 -->
        <el-table
            ref="dataTable"
            :class="$slots['btn-header']&&'margin-top'"
            :data="tableDataList"
            :loading="loading"
            :max-height="paging ? maxHeight : 9999"
            style="width: 100%"
            stripe
            :cell-class-name="cellClassName"
            @row-click="handleRowClick"
            @selection-change="selectLine"
            @sort-change="changeSort"
        >
            <template slot="empty">
                <el-empty />
            </template>
            <!-- 多选框 -->
            <el-table-column
                v-if="selection"
                type="selection"
                align="center"
                width="80"
            />
            <!-- 文本表头数据渲染 -->
            <template v-for="item in tableHead">
                <el-table-column
                    v-if="item.columnType==='slot'&&!item.filters"
                    :key="item.field"
                    :label="item.label"
                    :prop="item.field"
                    :width="item.width"
                    :show-overflow-tooltip="isWrap"
                    :min-width="_flexColumnWidth(item.label)"
                    :align="item.align"
                    :sortable="item.sortable"
                >
                    <template slot-scope="scope">
                        <slot
                            :name="item.field"
                            :data="scope.row"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    v-else-if="item.columnType==='slot'&&item.filters"
                    :key="item.field"
                    :label="item.label"
                    :prop="item.field"
                    :width="item.width"
                    :show-overflow-tooltip="isWrap"
                    :min-width="_flexColumnWidth(item.label)"
                    :align="item.align"
                    :sortable="item.sortable"
                    :filters="item.filters"
                    :filter-method="filterHandler"
                >
                    <template slot-scope="scope">
                        <slot
                            :name="item.field"
                            :data="scope.row"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    v-else-if="item.filters"
                    :key="item.field"
                    :prop="item.field"
                    :label="item.label"
                    :width="item.width"
                    :min-width="_flexColumnWidth(item.label)"
                    :align="item.align"
                    :show-overflow-tooltip="isWrap"
                    :formatter="item.formatter || assetTableFormatter"
                    :sortable="item.sortable"
                    :filters="item.filters"
                    :filter-method="filterHandler"
                />
                <el-table-column
                    v-else
                    :key="item.field"
                    :prop="item.field"
                    :label="item.label"
                    :width="item.width"
                    :show-overflow-tooltip="isWrap"
                    :min-width="_flexColumnWidth(item.label)"
                    :align="item.align"
                    :formatter="item.formatter || assetTableFormatter"
                    :sortable="item.sortable"
                />
            </template>
        </el-table>
        <el-footer
            v-if="paging"
            class="footer"
        >
            <span
                v-if="selection"
                class="selected-number"
            >已选中<span>{{ selectedNum }}</span>条</span>
            <el-pagination
                :layout="layout"
                :page-sizes="pageSizeOptions"
                :page-size="pageSize"
                :current-page="currentPage"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            />
        </el-footer>
    </div>
</template>

<script>
import { flexColumnWidth } from "@/utils";

export default {
    name: "TablePagination",
    components: {},
    props: {
        tableHeadConfig: {
            type: Array,
            default: () => []
        },
        tableData: {
            type: Array,
            default: () => []
        },
        maxHeight: {
            type: Number,
            default: 600
        },
        cellClassName: {
            type: Function,
            default: () => {}
        },
        loading: {
            type: Boolean,
            default() {
                return false;
            }
        },
        isWrap: {
            type: Boolean,
            default() {
                return true;
            }
        },
        selection: {
            type: Boolean,
            default: true
        },
        pageSizeOptions: {
            type: Array,
            default: () => [5, 10, 30, 50, 100]
        },
        // 分页数据总数
        total: {
            type: Number,
            default: 0,
            required: false
        },
        layout: {
            type: String,
            default: "total, sizes, prev, pager, next, jumper"
        },
        // 是否分页，默认为true，即分页。
        paging: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: this.paging ? 10 : Number.MAX_SAFE_INTEGER,
            selections: []
        };
    },
    computed: {
        // 选中条数
        selectedNum() {
            return this.selections.length
        },
        tableDataList() {
            return this.tableData;
        },
        tableHead() {
            return this.tableHeadConfig;
        }
    },
    mounted() {},
    methods: {
        assetTableFormatter(row, column, cellValue) {
            // TODO
            // if (cellValue == null || cellValue === "") {
            // 	return '-';
            // } else {
            return cellValue
            // }
        },
        // 表格宽度自适应内容长度
        _flexColumnWidth(label) {
            return flexColumnWidth(label)
        },
        selectLine(selections) {
            this.selections = selections
            this.$emit("selectLine", selections); // this.$refs.dataTable.selection
        },
        handleCurrentChange: function(currentPage) {
            this.currentPage = currentPage;
            this.onQuery();
        },
        handleSizeChange: function(pageSize) {
            this.pageSize = pageSize;
            this.onQuery();
        },
        //查询
        onQuery() {
            this.$emit("query", this.pageSize, this.currentPage);
        },
        // 从后台获取数据,重新排序
        changeSort(val) {
            console.log(val); // column: {…} order: "ascending" prop: "date"
            // 根据当前排序重新获取后台数据,一般后台会需要一个排序的参数
            this.$emit("changeSort", val);
        },
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        handleRowClick(row, column, event) {
            this.$refs["dataTable"].toggleRowSelection(row);
        }
    }
};
</script>
<style lang="scss" scope>
.margin-top {
  	margin-top: 20px;
}

.footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    .selected-number {
        font-size: 14px;
        color: #606266;
        position: absolute;
        left: 0;
        span {
            padding: 0 3px;
            color: #1fb860;
        }
    }
}
</style>