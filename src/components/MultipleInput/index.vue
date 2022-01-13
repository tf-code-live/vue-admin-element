<template>
    <div
        v-click-outside="hideOutside"
        class="multiple-input"
        :style="activeColor"
        @click="focusInput"
    >
        <i class="el-icon-search" />
        <span
            v-if="!isWriting&&(searchKey === ''&&tags.length===0)"
            class="placeholder"
        >请输入查找内容(整数、浮点、日期可区间查找，用英文逗号分割。日期类型格式为xxxx-xx-xx)</span>
        <div class="input__tags">
            <el-tag
                v-for="(item, index) in tags"
                :key="index"
                type="info"
                closable
                :disable-transitions="true"
                @close.stop="handleClose(item)"
            >
                {{ item.value }}
            </el-tag>
            <div class="input__outside">
                <input
                    ref="iInput"
                    v-model="searchKey"
                    type="text"
                    :style="{width: calcInputWidth}"
                    class="input__area"
                    @keyup.delete="backDelete"
                    @input="calcTextWidth"
                    @compositionstart="compositionstart"
                    @compositionend="compositionend"
                    @keydown.enter="search"
                >
                <div
                    v-if="isShowOutside && outsideOptions.length > 0"
                    class="outside__area"
                >
                    <div
                        v-for="(s, i) in outsideOptions"
                        :key="i"
                        class="outside__area-item"
                        @click.stop="outsideSelectedItem(s)"
                    >
                        {{ s.label }}
                    </div>
                </div>
            </div>
        </div>
        <i
            v-if="tags.length > 0 || searchKey!==''"
            class="el-icon-close"
            @click.stop="clearAll"
        />
    </div>
</template>

<script>
export default {
    directives: {
		 'click-outside': {
			 bind(el,bindings,vnode){
                el.handler = function (e) {
                    if(!el.contains(e.target)){
                        let method = bindings.expression;
                        vnode.context[method]();
                    }
                }
                document.addEventListener('click',el.handler)
            },
            unbind(el){
                document.removeEventListener('click',el.handler)
            }
		 }
    },
    props: {
        propOptions: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            inputWidth: 2,
            isShowOutside: false, // 是否显示面板
            searchKey: '', // 搜索项
            tags: [], // 所有tag项123, 345, 'abc', 'cbd'
            // outsideOptions: this.propOptions, // 面板备选项
            activeBorderColor: false, // multiple-input外边框是否活跃状态
            isBackDeleteEvent: false, // 标识回删键删除时内容已经清空
            isOutsideSelected: false, // 标识是否是选择的面板内容
            isWriting: false,
        };
    },
    computed: {
        outsideOptions() {
            let newOptions = this.tags.map(t => t.value.split(':')[0])
            return this.propOptions.filter(item => {
                return !newOptions.includes(item.label)
            })
        },
        // 动态计算input宽度
        calcInputWidth() {
            return this.inputWidth + 'px'
        },
        // multiple-input区域活跃时
        activeColor() {
            if (this.activeBorderColor) {
                return {
                    'border-color': '#1fb860',
                    'box-shadow': '0 0 4px 0 #1fb860'
                }
            } else {
                return {'border-color': '#dcdfe6'}
            }
        }
    },
    // 更新完成后让input获取焦点
    updated() {
        this.$refs['iInput'].focus()
    },
    methods: {
        compositionstart() {
            this.isWriting = true
        },
        compositionend() {
            this.isWriting = false
        },
        // 清除条件选项
        clearAll() {
            this.tags = []
            this.searchKey = ''
            this.$emit('search', this.tags)
        },
        // 面板项选择
        outsideSelectedItem(s) {
            let label = s.label
            this.searchKey = `${s.label}:`
            this.inputWidth = this.searchKey.length * 14
            this.$refs['iInput'].focus()
            this.isShowOutside = false
            this.isOutsideSelected = true
        },
        // 监听键盘的回删事件
        backDelete(e) {
            if (this.isBackDeleteEvent&&this.searchKey === '') {
                let item = this.tags.pop()
                this.$emit('search', this.tags)
            } else if (this.searchKey === '') {
                this.isBackDeleteEvent = true
            } else {
                this.isBackDeleteEvent = false
            }
            this.isShowOutside = false
        },
        // 清除tag项，这里需要做重新发起请求的操作
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
            this.$emit('search', this.tags)
        },
        // 监听input的input事件，计算input宽度
        calcTextWidth(val) {
            this.isShowOutside = false
            let valLen = this.$refs['iInput'].value.length
            this.inputWidth = valLen * 14
        },
        // enter搜索
        // 对于是属性名的，需要拼接成prop_id: value, 如"主机名:123" -> hostname: 123
        // 如果不是属性名，则只需要fuzzySearchKeywords: item
        search() {
            if (this.searchKey !== '') {
                this.handleTagsAndSearchKey(this.tags, this.searchKey)
                this.searchKey = ''
                this.isShowOutside = false
                this.isOutsideSelected = false
                this.$emit('search', this.tags)
            }
        },
        handleTagsAndSearchKey(tags, searchKey) {
            // 情况：
            // 1、下拉的内容通过点击生成，必须要带：分隔，否则生成2的内容
            // obj = {
            // value: searchKey,
            // prop_id: searchKey[1],
            // prop_name: searchKey[0]
            // }
            // 2、输入框输入的内容生成
            // obj = {
            // value: searchKey,
            // fuzzySearchKeywords: searchKey
            // }
            // 是否是选择了面板项
            let notMatch = true
            let isFuzzySearchKeywords = false
            if (this.isOutsideSelected) {
                // 选择了面板 && 有: && length===2
                if (searchKey.indexOf(':' !== -1)&&searchKey.split(':').length===2) {
                    let sArr = searchKey.split(':')
                    if (sArr[1] === '') {
                        this.sendNotification("warning", "警告", "请输入搜索关键字")
                        throw '请输入搜索关键字'
                    }
				 	for (let i = 0; i < tags.length; i++) {
                        let t = tags[i]
                        if (t.prop_name === sArr[0]) {
                            // 匹配到了现有的搜索条件，直接替换
                            t[t.prop_id] = sArr[1]
                            return
                        }
                    }
                    this.propOptions.forEach( p => {
                        if (p.label === sArr[0]) {
                            // 匹配到了属性，则添加该属性
                            tags.push({
                                value: searchKey,
                                [p.prop]: sArr[1],
                                prop_name: sArr[0],
                                prop_id: p.prop
                            })
                            notMatch = false
                        }
                    })
                }
            }
            // 如果没有匹配到则添加/替换模糊查找条件
            notMatch
			&& tags.forEach( t => {
			    if (t.hasOwnProperty('fuzzySearchKeywords')) {
			        // 有该属性，则替换该属性
			        t.value = searchKey,
			        t.fuzzySearchKeywords = searchKey
			        isFuzzySearchKeywords = true
			    }
			})
			// 如果没有该属性，则添加该模糊查找条件
            notMatch && !isFuzzySearchKeywords
			&& tags.push({
			    value: searchKey,
			    fuzzySearchKeywords: searchKey
			})
        },
        // 点击
        focusInput(e) {
            this.$refs['iInput'].focus()
            this.activeBorderColor = true
            this.isShowOutside = true
        },
        // 点击其他区域隐藏面板
        hideOutside() {
            this.isShowOutside = false
            this.activeBorderColor = false
            this.$nextTick(() => {
                // updated更新后让输入框失去焦点
                this.$refs['iInput'].blur()
            })
        }
    }
};
</script>

<style lang="scss" scoped>
	.multiple-input {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		border: 1px solid;
		border-radius: 4px;
		padding: 5px 10px;
        width: 100%;
        background: #fff;

        .placeholder {
            position: absolute;
            top: 9px;
            left: 42px;
            z-index: 120;
            font-size: 14px;
            color: #aaa;
            white-space: nowrap;
            width: calc(100% - 50px);
            overflow: hidden;
        }

		.input__tags {
			flex: 1;
			text-align: left;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding: 0 15px;

			.el-tag {
				margin-right: 10px;
			}

			.input__outside {
				position: relative;
				// margin-left: 5px;

				.input__area {
					min-width: 2px;
					position: relative;
					height: 24px;
					padding: 0;
					border: 0;
					outline: none;
                    font-weight: 400;
                    font-size: 14px;
                    color: #606266;
					cursor: text;
					caret-color: #1fb860;
					pointer-events: auto;
					display: inline-block;
				}

				.outside__area {
					position: absolute;
					top: 30px;
                    left: 0;
                    z-index: 99;
					min-width: 150px;
					border: 1px solid #e4e7ed;
					border-radius: 4px;
					background-color: #fff;
					box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
					box-sizing: border-box;
					margin: 5px 0;
					max-height: 300px;
					overflow: auto;
					&-item {
						cursor: pointer;
						text-align: center;
                        line-height: 35px;
                        font-size: 14px;
						&:hover {
							background-color: #e9f8ef;
    						color: #4cc680;
						}
					}
				}

			}
			
		}

		.el-icon-close {
			cursor: pointer;
		}
	}
</style>
