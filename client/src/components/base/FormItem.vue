<!--
    Элемент формы, состоящий из метки и произвольного содержимого
    В слоте по умолчанию передаётся элемент формы
-->
<template>
    <div class="form-item">
        <div 
                class="form-item__label"
                :style="{
                    width,
                    textAlign: align
                }"
                @click="activeLink">
            <slot name="label"/>
        </div>
        <div ref="control" class="form-item__control">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FormItem',
    props: {
        // Метка элемента формы
        label: {
            type: String,
            default: ''
        },
        // Ширина, которая отводится под label
        width: {
            type: Number,
            default: null
        },
        // Выравнивание метки
        align: {
            type: String,
            default: 'left'
        }
    },
    methods: {
        activeLink() {
            let control = this.$refs.control.firstElementChild;
            if (control) {console.log(control)
                control.focus();
            }
        }
    }
}
</script>

<style lang="scss">
.form-item {
    display: flex;
}

.form-item__label {
    margin-right: 5px;
    cursor: pointer;
    user-select: none;
    &:hover {
        color: #555;
    }
}

.form-item__control {
    flex-grow: 1;
}
</style>
