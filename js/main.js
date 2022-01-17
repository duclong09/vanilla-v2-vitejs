import axiosClient from "./api/axiosClient"
import postApi from "./api/postApi"

console.log("long")

async function main(){
    try {
        const queryParams = {
            _page: 1,
            _limit: 5,
        }
        const reponsive = await postApi.getAll(queryParams)
        console.log(reponsive)
    } catch (error) {}
    await postApi.updateFormData({
        id: 'sktwi1cgkkuif36do',
        title: 'adipisci a enim 111'
    })
    
}
main()