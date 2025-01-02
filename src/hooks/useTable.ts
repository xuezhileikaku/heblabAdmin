import { ref, reactive } from 'vue'

export function useTable<T = any>(fetchData: (params: any) => Promise<any>) {
    const loading = ref(false)
    const list = ref<T[]>([])
    const total = ref(0)
    const queryParams = reactive({
        page: 1,
        pageSize: 10,
        keyword: ''
    })

    const getList = async () => {
        loading.value = true
        try {
            const res = await fetchData(queryParams)
            list.value = res.list
            total.value = res.total
        } finally {
            loading.value = false
        }
    }

    const handleSizeChange = (val: number) => {
        queryParams.pageSize = val
        getList()
    }

    const handleCurrentChange = (val: number) => {
        queryParams.page = val
        getList()
    }

    return {
        loading,
        list,
        total,
        queryParams,
        getList,
        handleSizeChange,
        handleCurrentChange
    }
}