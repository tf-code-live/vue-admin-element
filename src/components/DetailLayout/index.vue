<template>
    <div class="detail-layout">
        <div class="btn-header">
            <span
                class="back"
                @click="goBack"
            >
                <i class="el-icon-arrow-left" />
                <slot name="back-title" />
            </span>
        </div>
        <div class="accordion">
            <el-collapse
                v-model="accordionActiveName"
                accordion
            >
                <el-collapse-item name="1">
                    <template slot="title">
                        <slot name="collapse-title" />
                    </template>
                    <slot name="collapse-content" />
                </el-collapse-item>
            </el-collapse>
        </div>
        <el-tabs
            v-model="tabsActiveName"
            stretch
        >
            <template v-for="(child, index) in tabList.tabPanes">
                <el-tab-pane
                    v-if="child.isSlot"
                    :key="index"
                    :name="child.paneName"
                >
                    <template v-if="tabsActiveName === child.paneName">
                        <span slot="label">
                            <i :class="child.labelIcon" />
                            <span>{{ child.paneLabel }}</span>
                        </span>
                        <slot :name="child.slotName" />
                    </template>
                </el-tab-pane>
                <el-tab-pane
                    v-else
                    :key="index"
                    :label="child.paneLabel"
                    :name="child.paneName"
                >
                    <template v-if="tabsActiveName === child.paneName">
                        <slot :name="child.slotName" />
                    </template>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>

<script>
/**
 * tabList: {
 *  activeName: 'first',
 *  tabPanes: [
 *    { paneLabel: '资产关系', paneName: 'first', slotName: 'tab-first'},
 *    { paneLabel: '资产快照', paneName: 'second', slotName: 'tab-first'},
 *    { paneLabel: '其他信息', paneName: 'third', slotName: 'tab-first'},
 *  ]
 * }
 */
export default {
    name: "DetailLayout",
    props: {
        tabList: {
            type: Object,
            default: () => ({
                activeName: "1",
                tabPanes: []
            })
        },
        backRouter: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            accordionActiveName: "1",
            tabsActiveName: this.tabList.activeName
        }
    },
    methods: {
        goBack() {
            if (this.backRouter) {
                this.$router.push(this.backRouter)
            } else {
                history.back()
            }
        }
    }
}
</script>
<style lang='scss' scoped>
.btn-header {
	margin-bottom: 20px;
	color: #333333;
	.back {
		cursor: pointer;
	}
}
.accordion {
	user-select: text;
	margin: 0 -20px;
	padding: 0 20px;
	background-color: #fff;
	.el-collapse {
		border: none;
		.collapse-title {
			padding-right: 15px;
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
		.el-descriptions {
			padding: 20px 20px 0 60px;
		}
	}
}
</style>

<style lang="scss">
.accordion {
	.el-icon-arrow-right {
		display: inline-block;
		color: #333333;
		font-size: 16px;
		padding: 12px;
		&:hover {
			background: #edf2f7;
			border-radius: 50%;
			opacity: 0.8;
		}
	}
}

.detail-layout {
	// tabs样式
	.el-tabs {
		margin: 0 -20px;

		.el-tabs__nav-wrap {
			border-top: 1px solid #dfe4ed;
		}

		.el-tabs__header {
			background-color: #ffffff;
			margin-bottom: 20px;
		}

		.el-tabs__content {
			padding: 0 20px !important;
		}
	}
}
</style>

