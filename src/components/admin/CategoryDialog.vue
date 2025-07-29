<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑分类' : '新增分类'"
    width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="父级分类" prop="parent_id">
        <el-select
          v-model="form.parent_id"
          placeholder="请选择父级分类（不选则为一级分类）"
          clearable
          style="width: 100%"
          @change="handleParentChange"
        >
          <el-option
            v-for="parent in (parentCategories || [])"
            :key="parent.value"
            :label="parent.label"
            :value="parent.value"
            :disabled="parent.level >= 3"
          >
            <span :style="{ paddingLeft: (parent.level - 1) * 20 + 'px' }">
              {{ parent.label }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入分类名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="分类描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入分类描述"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="分类图片" prop="image">
        <div class="image-upload">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
            accept="image/*"
            drag
          >
            <div v-if="form.image" class="image-preview">
              <el-image
                :src="form.image"
                fit="cover"
                style="width: 100%; height: 100%;"
              />
              <div class="image-overlay">
                <el-icon><Edit /></el-icon>
                <span>点击更换</span>
              </div>
            </div>
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">
                <p>点击或拖拽上传分类图片</p>
                <p class="upload-tip">支持 JPG、PNG、GIF 格式，大小不超过 2MB</p>
              </div>
            </div>
          </el-upload>
          <el-button v-if="form.image" type="danger" size="small" @click="removeImage">
            删除图片
          </el-button>
        </div>
      </el-form-item>
      
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="form.sort"
          :min="0"
          :max="9999"
          placeholder="数字越小排序越靠前"
          style="width: 200px"
        />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="active">启用</el-radio>
          <el-radio label="inactive">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import { createCategory, updateCategory, uploadCategoryImage } from '@/api/category'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: null
  },
  parentCategories: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  parent_id: null,
  name: '',
  description: '',
  image: '',
  sort: 0,
  status: 'active',
  level: 1
})

// 计算属性
const isEdit = computed(() => !!props.category?.id)

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }
  ],
  sort: [
    { type: 'number', min: 0, max: 9999, message: '排序值在 0 到 9999 之间', trigger: 'blur' }
  ]
}

// 方法
const resetForm = () => {
  Object.assign(form, {
    parent_id: null,
    name: '',
    description: '',
    image: '',
    sort: 0,
    status: 'active',
    level: 1
  })
}

// 监听分类数据变化
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    Object.assign(form, {
      parent_id: newCategory.parent_id || null,
      name: newCategory.name || '',
      description: newCategory.description || '',
      image: newCategory.image || '',
      sort: newCategory.sort || 0,
      status: newCategory.status || 'active',
      level: newCategory.level || 1
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const handleParentChange = (parentId) => {
  if (parentId && props.parentCategories && Array.isArray(props.parentCategories)) {
    const parent = props.parentCategories.find(p => p && p.value === parentId)
    form.level = parent ? parent.level + 1 : 1
  } else {
    form.level = 1
  }
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleImageUpload = async (options) => {
  try {
    const response = await uploadCategoryImage(options.file)
    form.image = response.data.url
    ElMessage.success('图片上传成功')
  } catch (error) {
    ElMessage.error('图片上传失败')
    console.error('图片上传失败:', error)
  }
}

const removeImage = () => {
  form.image = ''
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    const submitData = {
      parent_id: form.parent_id || 0,
      name: form.name,
      description: form.description,
      image: form.image,
      sort: form.sort,
      status: form.status,
      level: form.level
    }
    
    if (isEdit.value) {
      await updateCategory(props.category.id, submitData)
      ElMessage.success('分类更新成功')
    } else {
      await createCategory(submitData)
      ElMessage.success('分类创建成功')
    }
    
    emit('success')
  } catch (error) {
    if (error.errors) {
      // 处理验证错误
      const firstError = Object.values(error.errors)[0]
      ElMessage.error(firstError[0])
    } else {
      ElMessage.error(isEdit.value ? '分类更新失败' : '分类创建失败')
    }
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}
</script>

<style scoped lang="scss">
.image-upload {
  width: 100%;
  
  :deep(.el-upload) {
    width: 100%;
    
    .el-upload-dragger {
      width: 100%;
      height: 200px;
      position: relative;
      border: 2px dashed var(--color-border);
      border-radius: var(--border-radius);
      background-color: var(--color-bg-primary);
      transition: all 0.3s;
      
      &:hover {
        border-color: var(--color-button);
        background-color: var(--color-bg-hover);
      }
    }
  }
  
  .image-preview {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      @include flex-center;
      flex-direction: column;
      gap: var(--spacing-sm);
      color: white;
      opacity: 0;
      transition: opacity 0.3s;
      
      &:hover {
        opacity: 1;
      }
      
      .el-icon {
        font-size: 24px;
      }
    }
  }
  
  .upload-placeholder {
    @include flex-center;
    flex-direction: column;
    gap: var(--spacing-md);
    height: 100%;
    color: var(--color-text-secondary);
    
    .upload-icon {
      font-size: 48px;
      color: var(--color-text-placeholder);
    }
    
    .upload-text {
      text-align: center;
      
      p {
        margin: 0;
        line-height: 1.5;
      }
      
      .upload-tip {
        font-size: var(--font-size-sm);
        color: var(--color-text-placeholder);
      }
    }
  }
  
  .el-button {
    margin-top: var(--spacing-sm);
  }
}

.dialog-footer {
  text-align: right;
}
</style>
