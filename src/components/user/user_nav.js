import { ref } from "vue";
import api from "@/api/api"


const fetchCategories = async () => {
  try {
    const response = await api.get(`/category/categoryList`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}

const categoryList = ref([]);
const userNavList = ref([]);

fetchCategories().then((value) => {
  categoryList.value = value;
  for (let item of categoryList.value) {
    console.log(item);
    userNavList.value.push({
      component: 'CNavItem',
      name: item.categoryName,
      to: `/products/${item.categoryName}`,
      icon: 'cil-speedometer',
    })
  }
});

export default userNavList.value
