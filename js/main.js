import axiosClient from "./api/axiosClient"
import postApi from "./api/postApi"

console.log("long")

async function main(){
    const queryParams = {
        _page: 1,
        _limit: 5,
    }
    const reponsive = await postApi.getAll(queryParams)
    console.log(reponsive)
}
main()