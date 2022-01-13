<template>
    <el-form
        :ref="formData.formRef"
        :rules="formData.rules"
        :model="formData.formModel"
        :label-position="labelPosition"
        :label-width="labelWidth"
    >
        <slot name="formTop" />
        <el-form-item
            v-for="(item, key) in formData.formContent"
            :key="key"
            :rules="item.rule"
            :label="item.formLabel"
            :prop="item.model"
        >
            <!-- 输入框/文本域 -->
            <el-input
                v-if="item.formType == 'text' || item.formType == 'textarea'"
                :ref="item.model"
                v-model="formData.formModel[item.model]"
                :type="item.formType"
                :placeholder="item.placeholder"
                :disabled="item.disabled "
            />
            <!-- 选择器 -->
            <el-select
                v-if="item.formType == 'select'"
                :ref="item.model"
                v-model="formData.formModel[item.model]"
                :placeholder="item.placeholder"
                clearable
                filterable
                @change="selectChange(item.checkType)"
            >
                <el-option
                    v-for="i in item.options"
                    :key="i.value"
                    :label="i.label"
                    :value="i.value"
                />
            </el-select>
            <el-select
                v-if="item.formType == 'allowCreateSelect'"
                :ref="item.model"
                v-model="formData.formModel[item.model]"
                :placeholder="item.placeholder"
                clearable
                filterable
                allow-create
                default-first-option
                @change="selectChange(item.checkType)"
            >
                <el-option
                    v-for="i in item.options"
                    :key="i.value"
                    :label="i.label"
                    :value="i.value"
                />
            </el-select>
            <!-- 单选框 -->
            <el-radio-group
                v-if="item.formType == 'radio' || item.formType == 'radioButton'"
                v-model="formData.formModel[item.model]"
                :size="item.size"
            >
                <!-- 普通单选框 -->
                <template v-if="item.formType == 'radio'">
                    <el-radio
                        v-for="(radio, key1) in item.radio"
                        :key="key1"
                        :label="radio.label"
                        :border="radio.border"
                        :disabled="radio.disabled"
                    />
                </template>
                <!-- 按钮形式的单选框 -->
                <template v-if="item.formType == 'radioButton'">
                    <el-radio-button
                        v-for="(radio, key1) in item.radio"
                        :key="key1"
                        :label="radio.label"
                        :disabled="radio.disabled"
                    />
                </template>
            </el-radio-group>
            <!-- 复选框 -->
            <el-checkbox-group
                v-if="item.formType == 'elCheckboxGroup'"
                v-model="formData.formModel[item.model]"
                :size="item.size"
            >
                <el-checkbox
                    v-for="(checkbox, key2) in item.checkbox"
                    :key="key2"
                    :label="checkbox.label"
                    :border="checkbox.border"
                    :disabled="checkbox.disabled"
                    :name="item.model"
                >
                    {{ checkbox.label }}
                </el-checkbox>
            </el-checkbox-group>
            <!-- 日期时间选择器 -->
            <el-date-picker
                v-if="item.formType == 'dateTimeDicker'"
                :ref="item.model"
                v-model="formData.formModel[item.model]"
                :type="item.type"
                :placeholder="item.placeholder"
                :format="item.format"
                :value-format="item.valueFormat"
            />
        </el-form-item>
        <slot name="formBtn" />
    </el-form>
</template>
<script>
/**
form 总共包含 单选框 多选框 输入框/文本域 选择器 日期时间选择器
labelWidth: '', // 标签长度
labelPosition:'', // right/left/top 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
formData: {
	formRef: '', // 表单ref
	formModel: {}, // 表单数据对象
	rules: {}, // 	表单验证规则
	formContent: [
		{
			formLabel: '', // 标签
			formType: 'text', // 判断类型
			model: '', // 绑定值
			placeholder: '', // 提示语
			disabled : true, // 禁用状态
		},
		{
			formLabel: '', // 标签
			formType: 'select',
			model: '',
			placeholder: '',
			checkType: '', // 当需要change方法时 用来做使用方法判断的
			options: [
				{
					value: '我是隐藏的和获取的值',
					label: '我是显示的值'
				}
			] // 选项的值
		},
		{
			formLabel: '', // 标签
			formType: 'radio', // radioButton 按钮形式  radio 普通形式
			model: '',
			size: '', // medium / small / mini	*Radio 的尺寸，仅在 border 为真时有效
			radio: [{
				label: '', // 标题
				disabled: false, // 禁用
				border: false // 边框 radio
			}]
		},
		{
			formLabel: '', // 标签
			formType: 'checkbox',
			model: '',
			size: '', // medium / small / mini	*多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效
			checkbox: [{
				label: '', // 标题
				disabled: false, // 禁用
			}]
		},
		{
			formLabel: '', // 标签
			formType: 'dateTimeDicker',
			model: '',
			type: '', // year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
			placeholder: '',
			format: 'yyyy-MM-dd HH:mm:ss', // 格式
			valueFormat: 'yyyy-MM-dd HH:mm:ss' // 格式
		}
	],
}
*/
export default {
    props: {
        labelWidth: {
            type: String,
            default: '80px'
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        formData: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        submit(formName) {
            let res = null
            this.$refs[formName].validate(valid => {
                if (valid) {
                    res = true
                } else {
                    this.sendNotification("warning", "警告", "请检查表单项");
                    res = false
                }
            })
            return res
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        selectChange(checkType) {
            // console.log(checkType)
            if (checkType === undefined) {
                // console.log('und')
            } else if (checkType === "") {
                // console.log('asdf')
            } else {
                // console.log('父组件方法')
                this.$emit("selectChange", checkType)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>